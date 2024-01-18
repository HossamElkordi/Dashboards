import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTopbarComponent } from './module-topbar.component';

describe('ModuleTopbarComponent', () => {
  let component: ModuleTopbarComponent;
  let fixture: ComponentFixture<ModuleTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleTopbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
