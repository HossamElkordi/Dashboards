import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NboComponent } from './nbo.component';

describe('NboComponent', () => {
  let component: NboComponent;
  let fixture: ComponentFixture<NboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NboComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
