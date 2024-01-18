import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FraudModuleComponent } from './fraud-module.component';

describe('FraudModuleComponent', () => {
  let component: FraudModuleComponent;
  let fixture: ComponentFixture<FraudModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FraudModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FraudModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
