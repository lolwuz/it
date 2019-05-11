import ast
import datetime
import json
from flask_socketio import emit

from app.Boggle import Boggle
from constant import word_points
from models.board import Board
from models.score import Score

b = Boggle("constant/TWL06.txt")


class Game:
    def __init__(self, game_code):
        # live game data
        self.started = False
        self.game_over = False
        self.cursors = []
        # static game data
        self.game_code = game_code
        self.players = []
        self.words = []
        self.board = ''
        self.guessed = []
        self.start_time = None
        self.end_time = None

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

    """--------------------------------------- Game functions ----------------------------------------"""

    def new_word(self, word, player_id):
        """ Player guessed a new word """
        self.guessed = [({'word': word, 'player_id': player_id, 'points': self.get_points(word)})] + self.guessed

    def get_points(self, word):
        """ Get the correct points for a word """
        for guess in self.guessed:
            if guess['word'] == word:
                return 0  # Return 0 points when word is already guessed

        if word not in self.words:
            return 0

        word_length = len(word)
        if 3 <= word_length <= 8:
            return word_points.points[str(len(word))]
        if word_length >= 8:
            return 11

        return 0

    def start_game(self):
        self.start_time = datetime.datetime.now() + datetime.timedelta(seconds=3)
        self.end_time = datetime.datetime.now() + datetime.timedelta(seconds=63)

    def get_game_loop(self):
        remaining_second = 0
        if self.started and not self.game_over:
            delta_time = self.end_time - datetime.datetime.now()
            remaining_second = delta_time.seconds

            if remaining_second == 0:
                self.game_over = True

        return {'time': remaining_second, 'status': self.game_over, 'cursors': self.cursors}

    def set_cursor(self, player_id, index):
        for cursor in self.cursors:
            if cursor['player_id'] == player_id:
                cursor['cursor'] = index
                return  # Cursor is already in list

        # If player_id cursor doesn't exist add to list.
        self.cursors.append({'player_id': player_id, 'cursor': index})

    """--------------------------------------- Lobby functions ----------------------------------------"""

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

        if ready and not self.started:
            self.start_game()

        self.started = ready

    def to_json(self):
        return json.dumps(list(self.words))
