import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsFilterComponent } from './clients-filter.component';

describe('ClientsFilterComponent', () => {
  let component: ClientsFilterComponent;
  let fixture: ComponentFixture<ClientsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientsFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
