import { Routes } from '@angular/router';
import { CertificateComponent } from './certificate.component';

export const CertificateRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            pathMatch: 'full',
            component: CertificateComponent
        },
    ]
}];
