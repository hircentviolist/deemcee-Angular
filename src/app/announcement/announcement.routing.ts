import { Routes } from '@angular/router';
import {AnnouncementComponent} from './announcement.component';

export const AnnouncementRoutes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      pathMatch: 'full',
      component: AnnouncementComponent
    }
  ]
}];
