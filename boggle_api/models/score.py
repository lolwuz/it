from app import db, ma


class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    board_id = db.Column(db.Integer, db.ForeignKey('board.id'), nullable=False)
    score = db.Column(db.Integer, unique=False)
    name = db.Column(db.String(12), unique=False)

    def __init__(self, board_id, score, name):
        self.board_id = board_id
        self.score = score
        self.name = name


class ScoreSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ('id', 'name', 'score')