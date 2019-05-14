import os
from flask import Flask
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO

app = Flask(__name__, template_folder='../templates')
basedir = os.path.abspath(os.path.dirname(__file__))

# Database config
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'crud.sqlite')

# Database helpers
db = SQLAlchemy(app)
ma = Marshmallow(app)

# Disable CORS for control allow origin: *
CORS(app, resources={r"/*": {"Access-Control-Allow-Origin": "*"}})

# Enable socket io
socketio = SocketIO(app)

# Import routes
from routes import board_routes