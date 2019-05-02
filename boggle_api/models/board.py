from app import db, ma


class Board(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    board = db.Column(db.String(240), unique=True)
    game_code = db.Column(db.String(6), unique=False)

    def __init__(self, board, game_code):
        self.board = board
        self.game_code = game_code


class BoardSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ('board', 'game_code')