import { Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';

export const ReportsRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            pathMatch: 'full',
            component: ReportsComponent
        },
        {
            path: ':id',
            component: ReportsComponent
        },
    ]
}];
