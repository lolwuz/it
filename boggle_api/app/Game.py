import ast
import json

from app.Boggle import Boggle
from models.board import Board

b = Boggle("constant/TWL06.txt")


class Game:
    def __init__(self, game_code):
        self.game_code = game_code
        self.started = False
        self.players = []
        self.words = []
        self.board = ''

        self.get_words()

    def get_words(self):
        board = Board.query.filter_by(game_code=self.game_code).first()

        # letters on the board
        letters = ast.literal_eval(board.board)
        letters = ''.join(letters)

        b.set_board(letters)

        self.board = board.board
        self.words = b.find_words()

    def is_in_words(self, word):
        if word in self.words:
            return True

        return False

    def add_player(self, name, player_id):
        self.players.append({'name': name, 'player_id': player_id, 'is_ready': False})

    def remove_player(self, player_id):
        for player in self.players:
            if player['player_id'] == player_id:
                self.players.remove(player)

    def set_player_ready(self, player_id, is_ready):
        for player in self.players:
            if player['player_id'] == player_id:
                player['is_ready'] = is_ready

        ready = True
        for player in self.players:
            if not player['is_ready']:
                ready = False

        self.started = ready

    def to_json(self):
        return json.dumps(list(self.words))