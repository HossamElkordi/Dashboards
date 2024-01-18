import { TestBed } from '@angular/core/testing';

import { NboServiceService } from './nbo-service.service';

describe('NboServiceService', () => {
  let service: NboServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NboServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
