from flask import Flask

app = Flask(__name__)
from flask_cors import CORS, cross_origin
app.config['CORS_HEADERS'] = 'Content-Type'

CORS(app)

@app.route('/')
@cross_origin()
def hello_world():
    return '<h1>HOI DIT IS EEN TEST</h1>'


if __name__ == '__main__':
    app.run()
