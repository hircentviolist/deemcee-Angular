import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreEvaluationReportComponent } from './centre-evaluation-report.component';

describe('CentreEvaluationReportComponent', () => {
  let component: CentreEvaluationReportComponent;
  let fixture: ComponentFixture<CentreEvaluationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreEvaluationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreEvaluationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
