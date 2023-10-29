import { TestBed } from '@angular/core/testing';

import { EventJobService } from './event-job.service';

describe('EventJobService', () => {
  let service: EventJobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventJobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
