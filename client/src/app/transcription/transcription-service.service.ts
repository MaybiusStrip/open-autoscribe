import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transcript } from './transcript';

@Injectable({
  providedIn: 'root'
})

export class TranscriptionService {
  private baseUrl = 'http://localhost:5000'; // Replace with your Flask server address

  constructor(private http: HttpClient) {}

  sendAudio(blob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('audio', blob);
    return this.http.post(`${this.baseUrl}/audio`, formData);
  }

  // listTranscripts(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/transcripts`);
  // }

  // listTranscripts return an Observable of Transcripts
  listTranscripts(): Observable<Transcript[]> {
    return this.http.get<Transcript[]>(`${this.baseUrl}/transcripts`);
  }

}

