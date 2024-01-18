import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAssetComponent } from './car-asset.component';

describe('CarAssetComponent', () => {
  let component: CarAssetComponent;
  let fixture: ComponentFixture<CarAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarAssetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
