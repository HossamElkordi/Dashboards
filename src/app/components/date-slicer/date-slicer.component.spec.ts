import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateSlicerComponent } from './date-slicer.component';

describe('DateSlicerComponent', () => {
  let component: DateSlicerComponent;
  let fixture: ComponentFixture<DateSlicerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateSlicerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateSlicerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
