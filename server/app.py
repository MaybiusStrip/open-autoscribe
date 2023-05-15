
from flask import Flask

app = Flask(__name__)

@app.route('/start-recording', methods=['POST'])
def start_recording():
    return 'Start recording endpoint'

@app.route('/stop-recording', methods=['POST'])
def stop_recording():
    return 'Stop recording endpoint'

if __name__ == '__main__':
    app.run(debug=True)

