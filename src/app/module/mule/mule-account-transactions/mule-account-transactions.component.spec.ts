import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuleAccountTransactionsComponent } from './mule-account-transactions.component';

describe('MuleAccountTransactionsComponent', () => {
  let component: MuleAccountTransactionsComponent;
  let fixture: ComponentFixture<MuleAccountTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MuleAccountTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MuleAccountTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
