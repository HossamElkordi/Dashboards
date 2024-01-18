import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographicMapComponent } from './geographic-map.component';

describe('GeographicMapComponent', () => {
  let component: GeographicMapComponent;
  let fixture: ComponentFixture<GeographicMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeographicMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeographicMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
