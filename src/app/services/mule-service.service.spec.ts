import { TestBed } from '@angular/core/testing';

import { MuleServiceService } from './mule-service.service';

describe('MuleServiceService', () => {
  let service: MuleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MuleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
