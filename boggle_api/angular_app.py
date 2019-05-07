from flask import Flask
from werkzeug.serving import run_simple
from flask import render_template

app = Flask(__name__, template_folder="angular", static_folder="angular/static")
app.debug = True


@app.route('/')
def hello_world():
    return render_template("index.html")


if __name__ == '__main__':
    run_simple('0.0.0.0', 5000, app, use_reloader=True, use_debugger=True, use_evalex=True)
