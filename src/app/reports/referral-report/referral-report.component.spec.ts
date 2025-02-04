import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralReportComponent } from './referral-report.component';

describe('ReferralReportComponent', () => {
  let component: ReferralReportComponent;
  let fixture: ComponentFixture<ReferralReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
