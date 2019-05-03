import secrets
import string
import ast
from random import shuffle, randint
from flask import jsonify
import itertools
from app import app, db
from constant import dice_dict, word_points
from models.board import Board, BoardSchema

from flask_cors import cross_origin

board_schema = BoardSchema()
boards_schema = BoardSchema(many=True)


@app.route("/board", methods=["POST"])
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
@app.route("/boards", methods=["GET"])
@cross_origin()
def get_boards():
    all_boards = Board.query.all()
    result = boards_schema.dump(all_boards)
    return jsonify(result.data)


# endpoint to get board detail by id
@app.route("/board/<game_code>", methods=["GET"])
@cross_origin()
def board_detail(game_code):
    board = Board.query.filter_by(game_code=game_code).first()
    return board_schema.jsonify(board)


# endpoint to update board
@app.route("/board/<game_code>/check/<word>", methods=["GET"])
@cross_origin()
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


@app.route("/board/solution/<game_code>", methods=["GET"])
@cross_origin()
def get_solution(game_code):
    board = Board.query.filter_by(game_code=game_code).first()

    # letters on the board
    letters = ast.literal_eval(board.board)

    graph = {
        '0': {'1', '4', '5'},
        '1': {'0', '2', '4', '5', '6'},
        '2': {'1', '3', '5', '6', '7'},
        '3': {'2', '6', '7'},
        '4': {'0', '1', '5'},
        '5': {'0', '1', '2', '4', '6', '8', '9', '10'},
        '6': {'1', '2', '3', '5', '7', '9', '10', '11'},
        '7': {'2', '3', '6'},
        '8': {'4', '5', '9', '12', '13'},
        '9': {'4', '5', '6', '8', '10', '12', '13', '14'},
        '10': {'5', '6', '7', '9', '11', '13', '14', '15'},
        '11': {'6', '7', '10', '14', '15'},
        '12': {'8', '9', '13' },
        '13': {'8', '9', '10', '12', '14'},
        '14': {'9', '10', '11', '13', '15'},
        '15': {'10', '11', '14'}
    }

    for key1 in graph:
        for key2 in graph:
            if key1 != key2:
                paths = list(bfs_paths(graph, key1, key2))

    return jsonify(letters)



def bfs_paths(graph, start, goal):
    queue = [(start, [start])]

    while queue:
        (vertex, path) = queue.pop(0)

        for next in graph[vertex] - set(path):
            if next == goal:
                yield path + [next]
            else:
                queue.append((next, path + [next]))


def get_dictionary():
    dictionary = set()
    with [line.rstrip('\n') for line in open('constant/opentaal_basis.txt', 'r')] as f:
        for word in f:
            dictionary.add(word)

    return dictionary
