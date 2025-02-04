import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { UpdateComponent } from './update/update.component';


const routes: Routes = [
  { path: 'list', component: ListComponent},
  { path: ':userType/add', component: AddComponent},
  { path: ':userType/update/:id', component: UpdateComponent},
  { path: '', pathMatch: 'full', redirectTo: 'list'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
