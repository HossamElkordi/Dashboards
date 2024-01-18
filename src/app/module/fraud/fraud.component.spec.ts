import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FraudComponent } from './fraud.component';

describe('FraudComponent', () => {
  let component: FraudComponent;
  let fixture: ComponentFixture<FraudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FraudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FraudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
