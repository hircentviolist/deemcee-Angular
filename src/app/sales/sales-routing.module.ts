import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListSalesComponent } from './list-sales/list-sales.component';
import { CreateSalesComponent } from './create-sales/create-sales.component';


const routes: Routes = [
  {path: 'create', component: CreateSalesComponent},
  {path: 'list', component: ListSalesComponent},
  {path: '', pathMatch: 'full', redirectTo: 'list'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
