import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsDistributionComponent } from './clients-distribution.component';

describe('ClientsDistributionComponent', () => {
  let component: ClientsDistributionComponent;
  let fixture: ComponentFixture<ClientsDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientsDistributionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
