import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';


const routes: Routes = [
  {path: 'menu', component: MenuComponent},
  {path: 'user', loadChildren: '../user/user.module#UserModule'},
  {path: 'branch', loadChildren: './licensee/licensee.module#LicenseeModule'},
  {path: 'structure', loadChildren: '../structure/structure.module#StructureModule'},
  {path: 'calendar', loadChildren: '../calendar/calendar.module#CalendarModule'},
  {path: 'class', loadChildren: '../classes/classes.module#ClassesModule'},
  {path: 'merchandise', loadChildren: '../merchandise/merchandise.module#MerchandiseModule'},
  {path: 'enrollment', loadChildren: '../enrollment/enrollment.module#EnrollmentModule'},
  {path: 'sales', loadChildren: '../sales/sales.module#SalesModule'},
  {path: 'reports', loadChildren: '../reports/reports.module#ReportsModule'},
  {path: 'dpoints', loadChildren: '../dpoints/dpoints.module#DPointsModule'},
  {path: 'notification', loadChildren: '../notification/notification.module#NotificationModule'},
  {path: 'announcement', loadChildren: '../announcement/announcement.module#AnnouncementModule'},
  {path: 'profile', loadChildren: '../profile/profile.module#ProfileModule'},
  {path: 'settings', loadChildren: '../settings/settings.module#SettingsModule'},
  {path: 'promocode', loadChildren: '../promo-code/promo-code.module#PromoCodeModule'},
  {path: 'certificate', loadChildren: '../certificate/certificate.module#CertificateModule'},
  {path: '', pathMatch: 'full', redirectTo: 'menu'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HqRoutingModule { }
