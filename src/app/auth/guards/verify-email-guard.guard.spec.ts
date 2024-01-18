import { TestBed } from '@angular/core/testing';

import { VerifyEmailGuard } from './verify-email-guard.guard';

describe('VerifyEmailGuardGuard', () => {
  let guard: VerifyEmailGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VerifyEmailGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
