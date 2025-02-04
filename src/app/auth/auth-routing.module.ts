import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgetComponent } from './forget/forget.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'forgot-password', component: ForgetComponent},
  { path: '', pathMatch: 'exact', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
