import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseAssetComponent } from './house-asset.component';

describe('HouseAssetComponent', () => {
  let component: HouseAssetComponent;
  let fixture: ComponentFixture<HouseAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseAssetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
