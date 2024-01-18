import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuleModuleComponent } from './mule-module.component';

describe('MuleModuleComponent', () => {
  let component: MuleModuleComponent;
  let fixture: ComponentFixture<MuleModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MuleModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MuleModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
