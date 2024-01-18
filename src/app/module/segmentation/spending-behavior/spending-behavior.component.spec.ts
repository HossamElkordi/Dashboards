import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingBehaviorComponent } from './spending-behavior.component';

describe('SpendingBehaviorComponent', () => {
  let component: SpendingBehaviorComponent;
  let fixture: ComponentFixture<SpendingBehaviorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpendingBehaviorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpendingBehaviorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
