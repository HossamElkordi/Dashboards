import { TestBed } from '@angular/core/testing';

import { MacroServiceService } from '../macro-service.service';

describe('MacroServiceService', () => {
  let service: MacroServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MacroServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
