import { TestBed } from '@angular/core/testing';

import { TranscriptionService } from './transcription-service.service';

describe('RecordingServiceService', () => {
  let service: TranscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
