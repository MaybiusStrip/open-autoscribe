import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranscriptionService } from '../transcription/transcription-service.service';
import { SocketIOService } from '../socketio-service.service';
import { Transcript } from '../transcription/transcript';

@Component({
  selector: 'app-recording',
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.scss']
})
export class RecordingComponent implements OnInit, OnDestroy {
  isRecording = false;
  isPaused = false;
  mediaRecorder: any;
  chunks: any[] = [];
  audioBlob!: Blob;
  transcripts: Transcript[] = [];
  transcript!: string;
  socketIOService = new SocketIOService();

  constructor(private transcriptionService: TranscriptionService) { }

  ngOnInit() {
    this.fetchTranscripts();
    this.socketIOService.connect();

    this.socketIOService.on('transcript', (data) => {
      console.log(data);
      this.transcript = data.transcript;
    });
  }

  ngOnDestroy() {
    this.stopRecording();
  }

  fetchTranscripts() {
    this.transcriptionService.listTranscripts().subscribe(transcripts=> {
      console.log(transcripts);
      this.transcripts = transcripts;
    });
  }

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event: { data: any; }) => {
        this.chunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
        this.chunks = [];

        this.transcriptionService.sendAudio(this.audioBlob).subscribe(() => {
          this.fetchTranscripts();
        });
      };

      this.mediaRecorder.start();
      this.isRecording = true;
    });
  }

  pauseRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.pause();
      this.isPaused = true;
    }
  }

  resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.isPaused = false;
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.isPaused = false;
    }
  }
}
