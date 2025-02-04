import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { ListSalesComponent } from './list-sales/list-sales.component';
import { CreateSalesComponent } from './create-sales/create-sales.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewSalesModalComponent } from './view-sales-modal/view-sales-modal.component';
import { ConfirmCreateSalesModalComponent } from './confirm-create-sales-modal/confirm-create-sales-modal.component';


@NgModule({
  declarations: [ListSalesComponent, CreateSalesComponent, ViewSalesModalComponent, ConfirmCreateSalesModalComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    NgbModalModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    ViewSalesModalComponent,
    ConfirmCreateSalesModalComponent
  ]
})
export class SalesModule { }
