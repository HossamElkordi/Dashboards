import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuleAccountsComponent } from './mule-accounts.component';

describe('MuleAccountsComponent', () => {
  let component: MuleAccountsComponent;
  let fixture: ComponentFixture<MuleAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MuleAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MuleAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
