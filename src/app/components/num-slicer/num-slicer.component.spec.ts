import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumSlicerComponent } from './num-slicer.component';

describe('NumSlicerComponent', () => {
  let component: NumSlicerComponent;
  let fixture: ComponentFixture<NumSlicerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumSlicerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumSlicerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
