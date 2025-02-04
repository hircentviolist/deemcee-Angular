import { Routes } from '@angular/router';
import { ShowComponent } from './dpoints-management/show/show.component';
import { DPointsComponent } from './dpoints.component';
import { ShowParentComponent } from './parents-transaction/show-parent/show-parent.component';

export const DPointRoutes: Routes = [{
    path: '',
    children: [
        {
            path: 'show/:key',
            component: ShowComponent
        },
        {
            path: 'parents/:parent_id',
            component: ShowParentComponent
        },
        {
            path: '',
            pathMatch: 'full',
            component: DPointsComponent
        },
    ]
}];
