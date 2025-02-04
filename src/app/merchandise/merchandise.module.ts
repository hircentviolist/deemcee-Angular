import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchandiseRoutingModule } from './merchandise-routing.module';
import { MerchandiseComponent } from './merchandise.component';
import { ProductComponent } from './product/product.component';
import { OrderComponent } from './order/order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbNavModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { UpdateOrderComponent } from './order/update-order.component';
import { SalesComponent } from './sales/sales.component';
import { ListSalesComponent } from './list-sales/list-sales.component';
import { SalesDetailsComponent } from './sales-details/sales-details.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { DoComponent } from './do/do.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ViewInventoryModalComponent } from './view-inventory-modal/view-inventory-modal.component';
import { AdjustInventoryModalComponent } from './adjust-inventory-modal/adjust-inventory-modal.component';
import { StockMovementModalComponent } from './stock-movement-modal/stock-movement-modal.component';
import { ProductAddMultipleComponent } from './product-add-multiple/product-add-multiple.component';
import { ConfirmCreateSalesModalComponent } from 'app/sales/confirm-create-sales-modal/confirm-create-sales-modal.component';
import { ConfirmRequestOrderModalComponent } from './confirm-request-order-modal/confirm-request-order-modal.component';
import { ShowOrderComponent } from './show-order/show-order.component';


@NgModule({
  declarations: [
    MerchandiseComponent,
    ProductComponent,
    OrderComponent,
    PlaceOrderComponent,
    UpdateOrderComponent,
    SalesComponent,
    ListSalesComponent,
    SalesDetailsComponent,
    InvoiceComponent,
    DoComponent,
    ProductDetailComponent,
    ViewInventoryModalComponent,
    AdjustInventoryModalComponent,
    StockMovementModalComponent,
    ProductAddMultipleComponent,
    ConfirmRequestOrderModalComponent,
    ShowOrderComponent],
  imports: [
    CommonModule,
    MerchandiseRoutingModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbModalModule,
    HttpClientModule,
  ],
  entryComponents: [
    ViewInventoryModalComponent,
    AdjustInventoryModalComponent,
    ConfirmRequestOrderModalComponent
  ]
})
export class MerchandiseModule { }
