import { Routes } from '@angular/router';
import {NotificationComponent} from './notification.component';

export const NotificationRoutes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      pathMatch: 'full',
      component: NotificationComponent
    }
  ]
}];
