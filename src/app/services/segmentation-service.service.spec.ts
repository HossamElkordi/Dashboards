import { TestBed } from '@angular/core/testing';

import { SegmentationServiceService } from './segmentation-service.service';

describe('SegmentationServiceService', () => {
  let service: SegmentationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SegmentationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
