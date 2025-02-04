import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';


const routes: Routes = [
  {path: 'user', loadChildren: '../user/user.module#UserModule'},
  {path: 'menu', component: MenuComponent},
  {path: 'calendar', loadChildren: '../calendar/calendar.module#CalendarModule'},
  {path: 'class', loadChildren: '../classes/classes.module#ClassesModule'},
  {path: 'merchandise', loadChildren: '../merchandise/merchandise.module#MerchandiseModule'},
  {path: 'enrollment', loadChildren: '../enrollment/enrollment.module#EnrollmentModule'},
  {path: 'profile', loadChildren: '../profile/profile.module#ProfileModule'},
  {path: 'sales', loadChildren: '../sales/sales.module#SalesModule'},
  {path: 'reports', loadChildren: '../reports/reports.module#ReportsModule'},
  {path: 'dpoints', loadChildren: '../dpoints/dpoints.module#DPointsModule'},
  {path: 'settings', loadChildren: '../settings/settings.module#SettingsModule'},
  {path: 'certificate', loadChildren: '../certificate/certificate.module#CertificateModule'},
  {path: '', pathMatch: 'full', redirectTo: 'menu'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule { }
