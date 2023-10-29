import { TestBed } from '@angular/core/testing';

import { SignUpsService } from './sign-ups.service';

describe('SignUpsService', () => {
  let service: SignUpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignUpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
