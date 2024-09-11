import { TestBed } from '@angular/core/testing';

import { SignalementService } from './signalement.service';

describe('SignalementService', () => {
  let service: SignalementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
