
from flask import Flask

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return 'Index Page'

@app.route('/start-recording', methods=['POST'])
def start_recording():
    return 'Start recording endpoint'

@app.route('/stop-recording', methods=['POST'])
def stop_recording():
    return 'Stop recording endpoint'

@app.errorhandler(404)
def not_found(e):
    return 'Not found', 404


if __name__ == '__main__':
    app.run(debug=True)

