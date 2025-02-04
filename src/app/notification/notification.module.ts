import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import {RouterModule} from '@angular/router';
import {NotificationRoutes} from './notification-routing.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import { CreateNotificationModalComponent } from './create-notification-modal/create-notification-modal.component';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [NotificationComponent, CreateNotificationModalComponent],
  imports: [
    RouterModule.forChild(NotificationRoutes),
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ]
})
export class NotificationModule { }
