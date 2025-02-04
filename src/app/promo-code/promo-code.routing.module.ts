import { Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { PromoCodeComponent } from './promo-code.component';

export const PromoCodeRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            pathMatch: 'full',
            component: PromoCodeComponent
        },
        {
            path: 'add',
            component: AddComponent
        },
        {
            path: 'edit/:id',
            component: AddComponent
        }
    ]
}];
