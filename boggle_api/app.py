import eventlet

eventlet.monkey_patch()
from flask import render_template
from app import socketio, app  # pep8 kan de pot op monkey patch moet eerst


@app.route('/')
def root():
    return render_template('index.html')


if __name__ == '__main__':
    socketio.run(app=app, host='127.0.0.1', port=5000, debug=True)
