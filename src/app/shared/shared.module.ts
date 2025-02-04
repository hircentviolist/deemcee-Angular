import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTableComponent } from './list-table/list-table.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ViewNotificationComponent } from './modal/view-notification/view-notification.component';



@NgModule({
  declarations: [ListTableComponent, ViewNotificationComponent],
  imports: [
    CommonModule,
    FlexLayoutModule
  ],
  exports: [
    ListTableComponent,
    FlexLayoutModule
  ]
})
export class SharedModule { }
