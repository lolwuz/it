import ast
import json

from app.Boggle import Boggle
from constant import word_points
from models.board import Board

b = Boggle("constant/TWL06.txt")


class Game:
    def __init__(self, game_code):
        self.game_code = game_code
        self.started = False
        self.players = []
        self.words = []
        self.board = ''
        self.guessed = []

        self.get_words()

    def get_words(self):
        """ Fill in the correct words """
        board = Board.query.filter_by(game_code=self.game_code).first()

        # letters on the board
        letters = ast.literal_eval(board.board)
        letters = ''.join(letters)

        b.set_board(letters)

        self.board = board.board
        self.words = b.find_words()

    def new_word(self, word, player_id):
        """ Player guessed a new word """
        if word in self.words:
            self.guessed = [({'word': word, 'player_id': player_id, 'points': self.get_points(word)})] + self.guessed

    def get_points(self, word):
        """ Get the correct points for a word """
        for guess in self.guessed:
            if guess['word'] == word:
                return 0  # Return 0 points when word is already guessed

        word_length = len(word)
        if 3 <= word_length <= 8:
            return word_points.points[str(len(word))]
        if word_length >= 8:
            return 11

    def add_player(self, name, player_id):
        """ Adds a new player (sid) to the game """
        self.players.append({'name': name, 'player_id': player_id, 'is_ready': False})

    def remove_player(self, player_id):
        """ Remove player when disconnected """
        for player in self.players:
            if player['player_id'] == player_id:
                self.players.remove(player)

    def set_player_ready(self, player_id, is_ready):
        """ Set player ready state """
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