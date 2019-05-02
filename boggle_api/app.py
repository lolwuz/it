from flask import Flask

app = Flask(__name__)
from flask_cors import CORS

CORS(app)

@app.route('/')
def hello_world():
    return '<h1>HOI DIT IS EEN TEST</h1>'


if __name__ == '__main__':
    app.run()
