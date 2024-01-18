import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalModuleComponent } from './approval-module.component';

describe('ApprovalModuleComponent', () => {
  let component: ApprovalModuleComponent;
  let fixture: ComponentFixture<ApprovalModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
