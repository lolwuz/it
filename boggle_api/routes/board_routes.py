import secrets
import string
from random import shuffle, randint
from flask import jsonify
from app import app, db
from constant import dice_dict, word_points
from models.board import Board, BoardSchema

board_schema = BoardSchema()
boards_schema = BoardSchema(many=True)


@app.route("/board", methods=["POST"])
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
@app.route("/boards", methods=["GET"])
def get_boards():
    all_boards = Board.query.all()
    result = boards_schema.dump(all_boards)
    return jsonify(result.data)


# endpoint to get board detail by id
@app.route("/board/<game_code>", methods=["GET"])
def board_detail(game_code):
    board = Board.query.filter_by(game_code=game_code).first()
    return board_schema.jsonify(board)


# endpoint to update board
@app.route("/board/<game_code>/check/<word>", methods=["GET"])
def is_valid_word(game_code, word):
    board = Board.query.filter_by(game_code=game_code).first()

    # board_info = json.load(board.board)

    check = {}
    check['is_valid'] = False
    check['points'] = 0

    lines = [line.rstrip('\n') for line in open('constant/opentaal_basis.txt', 'r')]

    for line in lines:
        if word == line:
            check['is_valid'] = True

            word_length = len(word)
            if 3 <= word_length <= 8:
                check['points'] = word_points.points[str(len(word))]
            if word_length >= 8:
                check['points'] = 11

    return jsonify(check)
