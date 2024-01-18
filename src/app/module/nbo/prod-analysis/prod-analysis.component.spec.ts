import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdAnalysisComponent } from './prod-analysis.component';

describe('ProdAnalysisComponent', () => {
  let component: ProdAnalysisComponent;
  let fixture: ComponentFixture<ProdAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
