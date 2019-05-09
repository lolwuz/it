import json
import secrets
import string
import ast
from random import shuffle, randint
from flask import jsonify, request
from app import app, db, socketio
from app.Boggle import Boggle
from app.Game import Game
from constant import dice_dict, word_points
from models.board import Board, BoardSchema
from flask_cors import cross_origin
from flask_socketio import join_room, leave_room, emit, send

board_schema = BoardSchema()
boards_schema = BoardSchema(many=True)


b = Boggle("constant/TWL06.txt")


@app.route("/api/board", methods=["POST"])
@cross_origin()
def add_board():
    def code_generator(size=6):
        return ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(size))

    random_dice_list = []
    for dice in dice_dict.dice:
        random_dice = dice[randint(0, 5)]
        random_dice_list.append(random_dice)

    shuffle(random_dice_list)

    json_random_dice_list = str(random_dice_list)

    new_board = Board(json_random_dice_list, code_generator())

    db.session.add(new_board)
    db.session.commit()

    return board_schema.jsonify(new_board)


# endpoint to show all boards
@app.route("/api/boards", methods=["GET"])
@cross_origin()
def get_boards():
    all_boards = Board.query.all()
    result = boards_schema.dump(all_boards)
    return jsonify(result.data)


# endpoint to get board detail by id
@app.route("/api/board/<game_code>", methods=["GET"])
@cross_origin()
def board_detail(game_code):
    board = Board.query.filter_by(game_code=game_code).first()
    return board_schema.jsonify(board)


# endpoint to update board
@app.route("/api/board/<game_code>/check/<word>", methods=["GET"])
@cross_origin()
def is_valid_word(game_code, word):
    board = Board.query.filter_by(game_code=game_code).first()

    # letters on the board
    letters = ast.literal_eval(board.board)
    letters = ''.join(letters)

    check = {'is_valid': False, 'points': 0, 'word': word}

    b.set_board(letters)

    all_words = b.find_words()

    if word.upper() in all_words:
        check['is_valid'] = True

        word_length = len(word)
        if 3 <= word_length <= 8:
            check['points'] = word_points.points[str(len(word))]
        if word_length >= 8:
            check['points'] = 11

    return jsonify(check)


@app.route("/api/board/solution/<game_code>", methods=["GET"])
@cross_origin()
def get_solution(game_code):
    board = Board.query.filter_by(game_code=game_code).first()

    # letters on the board
    letters = ast.literal_eval(board.board)
    letters = ''.join(letters)

    b.set_board(letters)

    return jsonify({'solved': list(b.find_words()), 'points': b.score()})


""" SOCKET FUNCTIONS """
ROOMS = {}  # dict to track active rooms


@socketio.on('join')
def on_join(data):
    """Join a game lobby"""
    room = data['room']
    name = data['username']

    if room not in ROOMS:
        game = Game(data['room'])
        ROOMS[room] = game

    game = ROOMS[room]
    game.add_player(name, request.sid)

    join_room(room)

    # If game is already started emit
    if game.started:
        game.set_player_ready(request.sid, True)
        emit('lobby_start', json.dumps(game.board), room=room)

    emit('lobby_update', json.dumps(game.players), room=room)


@socketio.on('leave')
def on_leave(data):
    """Leave the game lobby"""
    room = data['room']

    leave_room(room)
    game = ROOMS[room]
    game.remove_player(request.sid)

    emit('lobby_update', json.dumps(game.players), room=room)


@socketio.on('disconnect')
def on_disconnect():
    for key in ROOMS:
        game = ROOMS[key]
        for player in game.players:
            if player['player_id'] == request.sid:
                game.remove_player(request.sid)
                emit('lobby_update', json.dumps(game.players), room=game.game_code)


@socketio.on('ready')
def on_word(data):
    is_ready = data['is_ready']
    room = data['room']

    game = ROOMS[room]

    game.set_player_ready(request.sid, is_ready)

    if game.started:
        emit('lobby_update', json.dumps(game.players), room=room)
        emit('lobby_start', json.dumps(game.board), room=room)
    else:
        emit('lobby_update', json.dumps(game.players), room=game.game_code)


@socketio.on('check_word')
def on_word(data):
    room = data['room']
    word = data['word']
    game = ROOMS[room]

    game.new_word(word, request.sid)

    emit('game_update', json.dumps(game.guessed), room=room)