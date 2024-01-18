import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicSegmentationComponent } from './demographic-segmentation.component';

describe('DemographicSegmentationComponent', () => {
  let component: DemographicSegmentationComponent;
  let fixture: ComponentFixture<DemographicSegmentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemographicSegmentationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemographicSegmentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
