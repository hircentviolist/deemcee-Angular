import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbNavModule, NgbDropdownModule, NgbModalModule, NgbAccordionModule, NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ReportsComponent } from './reports.component';
import { ReportsRoutes } from './reports-routing.module';
import { LicenseeReportComponent } from './licensee-report/licensee-report.component';
import { MonthlyCentreProgressionComponent } from './monthly-centre-progression/monthly-centre-progression.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CustomTimeRangeComponent } from './modal/custom-time-range/custom-time-range.component';
import { ReferralReportComponent } from './referral-report/referral-report.component';
import { CentreEvaluationReportComponent } from './centre-evaluation-report/centre-evaluation-report.component';
import { NewEvaluationComponent } from './modal/new-evaluation/new-evaluation.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { FinanceReportComponent } from './finance-report/finance-report.component';

@NgModule({
    declarations: [
        ReportsComponent,
        LicenseeReportComponent,
        MonthlyCentreProgressionComponent,
        CustomTimeRangeComponent,
        ReferralReportComponent,
        CentreEvaluationReportComponent,
        NewEvaluationComponent,
        FinanceReportComponent,
    ],
    imports: [
        RouterModule.forChild(ReportsRoutes),
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        FlexLayoutModule,
        NgbNavModule,
        NgbDropdownModule,
        NgbModalModule,
        NgbModule,
        NgbAccordionModule,
        NgMultiSelectDropDownModule,
        NgxStarRatingModule
    ],
    entryComponents: [
        //
    ]
})

export class ReportsModule { }