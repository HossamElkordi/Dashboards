import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroModuleComponent } from './macro-module.component';

describe('MacroModuleComponent', () => {
  let component: MacroModuleComponent;
  let fixture: ComponentFixture<MacroModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacroModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacroModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
