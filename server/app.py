import threading
import whisper
import tinydb

import time
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

recordings_dir = os.path.join(os.path.dirname(__file__), 'recordings')
db = tinydb.TinyDB('db.json')

def transcribe_audio(path_to_audio_file):
    model = whisper.load_model("tiny")
    result = model.transcribe(path_to_audio_file)
    db.insert({'filename': path_to_audio_file, 'transcript': result["text"]})
    # emit the transcription result
    print(result["text"])
    socketio.emit('transcript', {'filename': path_to_audio_file, 'transcript': result["text"]})

@app.route('/', methods=['GET'])
def index():
    return 'Index Page'

@app.route('/audio', methods=['POST'])
def audio():
    audio_file = request.files['audio']
    timestamp = str(int(time.time()))
    filename = secure_filename(timestamp + '.wav')
    path_to_audio_file = os.path.join(recordings_dir, filename)
    audio_file.save(path_to_audio_file)
    threading.Thread(target=transcribe_audio, args=(path_to_audio_file,)).start()
    return jsonify({'message': 'audio received'}), 200

@app.route('/recordings', methods=['GET'])
def recordings():
    files = os.listdir(recordings_dir)
    print(files)
    return jsonify(files), 200

@app.route('/transcripts', methods=['GET'])
def transcriptions():
    return jsonify(db.all()), 200

@app.route('/transcripts/<filename>', methods=['GET'])
def transcription(filename):
    result = db.search(tinydb.where('filename') == filename)
    if len(result) == 0:
        return jsonify({'message': 'transcript not found'}), 404
    return jsonify(result[0]), 200

@app.errorhandler(404)
def not_found(e):
    return 'Not found', 404


if __name__ == '__main__':
    if not os.path.exists(recordings_dir):
        os.makedirs(recordings_dir)
    app.run(debug=True)
    socketio.run(app, port=5000)
