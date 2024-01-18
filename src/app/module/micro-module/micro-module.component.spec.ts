import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroModuleComponent } from './micro-module.component';

describe('MicroModuleComponent', () => {
  let component: MicroModuleComponent;
  let fixture: ComponentFixture<MicroModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MicroModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MicroModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
