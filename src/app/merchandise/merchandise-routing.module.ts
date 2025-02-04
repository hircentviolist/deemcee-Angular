import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchandiseComponent } from './merchandise.component';
import { SalesDetailsComponent } from './sales-details/sales-details.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductAddMultipleComponent } from './product-add-multiple/product-add-multiple.component';
import { ShowOrderComponent } from './show-order/show-order.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sales/:id',
        component: SalesDetailsComponent
      },
      {
        path: 'product/addmultiple',
        component: ProductAddMultipleComponent
      },
      {
        path: 'product/:id',
        component: ProductDetailComponent
      },
      {
        path: 'request/:id',
        component: ShowOrderComponent
      },
      {
        path: '',
        pathMatch: 'full',
        component: MerchandiseComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchandiseRoutingModule { }
