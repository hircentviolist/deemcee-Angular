import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbNavModule, NgbDropdownModule, NgbModalModule, NgbAccordionModule, NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CertificateRoutes } from './certificate-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CertificateComponent } from './certificate.component';
import { ReadyToPrintComponent } from './ready-to-print/ready-to-print.component';
import { PrintedComponent } from './printed/printed.component';

@NgModule({
    declarations: [
        CertificateComponent,
        ReadyToPrintComponent,
        PrintedComponent,
    ],
    imports: [
        RouterModule.forChild(CertificateRoutes),
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
    ],
    entryComponents: [
        //
    ]
})

export class CertificateModule { }