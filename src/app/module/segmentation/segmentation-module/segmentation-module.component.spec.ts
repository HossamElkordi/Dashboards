import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentationModuleComponent } from './segmentation-module.component';

describe('SegmentationModuleComponent', () => {
  let component: SegmentationModuleComponent;
  let fixture: ComponentFixture<SegmentationModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SegmentationModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegmentationModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
