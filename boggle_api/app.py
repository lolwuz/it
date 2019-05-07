from flask import Flask
from flask_cors import CORS
from werkzeug.wsgi import DispatcherMiddleware
from jquery_app import app as jquery
from angular_app import app as angular
from crud import app as backend

application = Flask(__name__)

application.wsgi_app = DispatcherMiddleware(backend)

CORS(application)

if __name__ == "__main__":
    application.run(debug=True)
