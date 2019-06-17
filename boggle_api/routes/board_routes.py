import json
import secrets
import string
import ast
import numpy
import sqlalchemy

from flask import jsonify, request, abort
from flask_cors import cross_origin
from random import shuffle, randint
from app import app, db, socketio
from app.Boggle import Boggle
from app.Game import Game
from constant import dice_dict, word_points
from models.board import Board, BoardSchema
from models.score import Score, ScoreSchema
from flask_socketio import join_room, leave_room, emit


board_schema = BoardSchema()
boards_schema = BoardSchema(many=True)

score_schema = ScoreSchema()
scores_schema = ScoreSchema(many=True)


b = Boggle("constant/lower.lst")


@app.route("/api/board", methods=["POST"])
@cross_origin()
def add_board():
    """ generate board and add to database """
    def code_generator(size=6):
        return ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(size))

    def random_board():
        """ generate a random board with dices """
        random_dice_list = []
        for dice in dice_dict.dice:
            random_dice = dice[randint(0, 5)]
            random_dice_list.append(random_dice)

        shuffle(random_dice_list)

        return str(random_dice_list)

    def get_good_board():
        """ Try to get a good board, no matter the cost """
        while True:
            new_random = random_board()

            # letters on the board
            letters = ast.literal_eval(new_random)
            letters = ''.join(letters)

            b.set_board(letters)
            all_words = b.find_words()

            count = 0
            for word in all_words:
                if len(word) >= 8:
                    count += 1

            if count > 4:
                return new_random

    new_board = Board(get_good_board(), code_generator())

    db.session.add(new_board)
    db.session.commit()

    return board_schema.jsonify(new_board)


# endpoint to show all boards
@app.route("/api/boards", methods=["GET"])
@cross_origin()
def get_boards():
    """ get all boards from the database and diplay to json """
    all_boards = Board.query.all()
    result = boards_schema.dump(all_boards)
    return jsonify(result.data)


# endpoint to get board detail by id
@app.route("/api/board/<game_code>", methods=["GET"])
@cross_origin()
def board_detail(game_code):
    """ get board by game_code """
    board = Board.query.filter_by(game_code=game_code).first_or_404()

    return board_schema.jsonify(board)


# endpoint to update board
@app.route("/api/board/<game_code>/check/<word>", methods=["GET"])
@cross_origin()
def is_valid_word(game_code, word):
    """ get word validity """
    board = Board.query.filter_by(game_code=game_code).first_or_404()

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
    """ get all possible words within a board """
    board = Board.query.filter_by(game_code=game_code).first_or_404()

    # letters on the board
    letters = ast.literal_eval(board.board)
    letters = ''.join(letters)

    b.set_board(letters)

    return jsonify({'solved': list(b.find_words()), 'points': b.score()})


@app.route("/api/board/scores/<game_code>", methods=["GET"])
@cross_origin()
def get_scores(game_code):
    """ returns all scores that have been made on the board """ 
    board = Board.query.filter_by(game_code=game_code).first_or_404()
    scores = Score.query.filter_by(board_id=board.id).all()

    result = scores_schema.dump(scores)
    return jsonify(result.data)


""" SOCKET FUNCTIONS """
ROOMS = {}  # dict to track active rooms


@socketio.on('join')
def on_join(data):
    """Join a game lobby"""
    room = data['room']
    name = data['username']

    if room not in ROOMS:
        game = Game(data['room'], b)
        ROOMS[room] = game

    game = ROOMS[room]
    game.add_player(name, request.sid)

    join_room(room)

    # If game is already started emit
    if game.started:
        game.set_player_ready(request.sid, True)
        emit('lobby_start', json.dumps(game.board), room=room)

    emit('lobby_update', json.dumps(game.players), room=room)
    emit('lobby_id', json.dumps({'player_id': request.sid}))


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
def on_ready(data):
    """" set player read """ 
    is_ready = data['is_ready']
    room = data['room']

    game = ROOMS[room]

    game.set_player_ready(request.sid, is_ready)

    if game.started:
        emit('lobby_start', json.dumps(game.board), room=room)

    emit('lobby_update', json.dumps(game.players), room=game.game_code)


@socketio.on('check_word')
def on_word(data):
    """ check word send to the server """
    room = data['room']

    word = data['word']
    game = ROOMS[room]

    if not game.game_over:
        game.new_word(word, request.sid)
        emit('game_update', json.dumps(game.guessed), room=room)


@socketio.on('game_loop')
def on_message(data):
    """ game loop """ 
    room = data['room']
    index = data['cursor']
    game = ROOMS[room]
    game.set_cursor(request.sid, index)

    if game.game_over:
        socketio.emit('game_end', json.dumps(game.get_game_score()), room=request.sid)
    else:
        socketio.emit('game_loop', json.dumps(game.get_game_loop()), room=request.sid)