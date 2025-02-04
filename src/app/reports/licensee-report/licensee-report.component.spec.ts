import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseeReportComponent } from './licensee-report.component';

describe('LicenseeReportComponent', () => {
  let component: LicenseeReportComponent;
  let fixture: ComponentFixture<LicenseeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
