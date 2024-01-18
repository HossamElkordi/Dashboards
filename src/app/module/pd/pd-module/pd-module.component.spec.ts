import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdModuleComponent } from './pd-module.component';

describe('PdModuleComponent', () => {
  let component: PdModuleComponent;
  let fixture: ComponentFixture<PdModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
