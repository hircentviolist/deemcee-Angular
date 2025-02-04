import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnrollmentRoutingModule } from './enrollment-routing.module';
import { EnrollmentComponent } from './enrollment.component';
import { NewComponent } from './new/new.component';
import { ShowComponent } from './show/show.component';
import { ListComponent } from './list/list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {NgbTabsetModule, NgbDropdownModule, NgbModalModule, NgbAccordionModule, NgbDate, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ClassDetailsComponent } from './show/class-details.component';
import { PastEnrollmentComponent } from './show/past-enrollment.component';
import { DetailsComponent } from './show/details.component';
import { AdvanceComponent } from './modal/advance/advance.component';
import { ExtendComponent } from './modal/extend/extend.component';
import { FreezeComponent } from './modal/freeze/freeze.component';
import { GraduateComponent } from './modal/graduate/graduate.component';
import { DropoutComponent } from './modal/dropout/dropout.component';
import { TransferComponent } from './modal/transfer/transfer.component';
import { PayComponent } from './modal/pay/pay.component';
import { DeleteComponent } from './modal/delete/delete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RescheduleComponent } from './modal/reschedule/reschedule.component';
import { TransferInComponent } from './modal/transfer/transfer-in/transfer-in.component';
import { TransferInDetailsComponent } from './modal/transfer/transfer-in-details/transfer-in-details.component';
import { VideoAssignmentComponent } from './modal/video-assignment/video-assignment.component';
import { VideoAssignmentDetailsComponent } from './video-assignment-details/video-assignment-details.component';
import { EditComponent } from './modal/edit/edit.component';
import { PaymentHistoryComponent } from './show/payment-history.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PromoCodeComponent } from './modal/promo-code/promo-code.component';
import { PastEnrolmentComponent } from './show/past-enrolment/past-enrolment.component';
import { ChangeClassComponent } from './modal/change-class/change-class.component';
import { EditPaymentComponent } from './modal/edit-payment/edit-payment.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NoteComponent } from './modal/note/note.component';
import { EditExtendComponent } from './modal/edit-extend/edit-extend.component';


@NgModule({
  declarations: [
    EnrollmentComponent,
    NewComponent,
    ShowComponent,
    ListComponent,
    DetailsComponent,
    ClassDetailsComponent,
    PastEnrollmentComponent,
    AdvanceComponent,
    ExtendComponent,
    FreezeComponent,
    GraduateComponent,
    DropoutComponent,
    TransferComponent,
    PayComponent,
    DeleteComponent,
    RescheduleComponent,
    TransferInComponent,
    TransferInDetailsComponent,
    VideoAssignmentComponent,
    VideoAssignmentDetailsComponent,
    EditComponent,
    PaymentHistoryComponent,
    PromoCodeComponent,
    PastEnrolmentComponent,
    ChangeClassComponent,
    NoteComponent,
    EditPaymentComponent,
    EditExtendComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EnrollmentRoutingModule,
    FlexLayoutModule,
    NgbTabsetModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    NgbAccordionModule,
    FontAwesomeModule
  ],
  entryComponents: [
    AdvanceComponent,
    ExtendComponent,
    FreezeComponent,
    GraduateComponent,
    DropoutComponent,
    TransferComponent,
    PayComponent,
    ChangeClassComponent,
    DeleteComponent
  ]
})
export class EnrollmentModule { }
