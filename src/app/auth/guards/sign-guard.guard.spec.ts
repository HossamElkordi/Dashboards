import { TestBed } from '@angular/core/testing';

import { SignGuard } from './sign-guard.guard';

describe('SignGuardGuard', () => {
  let guard: SignGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SignGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
