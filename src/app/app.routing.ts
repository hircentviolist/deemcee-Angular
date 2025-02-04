import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthGuard } from './auth/auth.guard';
import { HqGuard } from './hq.guard';
import { BranchGuard } from './branch.guard';
import { LoggedInOnlyGuard, RedirectIfLogin } from './app.guard';

export const AppRoutes: Routes = [
    {
        path: 'auth',
        canActivate: [RedirectIfLogin],
        loadChildren: './auth/auth.module#AuthModule'
    },
    {
        path: 'hq',
        component: AdminLayoutComponent,
        canActivate: [LoggedInOnlyGuard],
        children: [{
            path: '',
            loadChildren: './hq/hq.module#HqModule'
        }]
    },
    {
        path: 'branch',
        component: AdminLayoutComponent,
        canActivate: [LoggedInOnlyGuard],
        children: [{
            path: '',
            loadChildren: './branch/branch.module#BranchModule'
        }]

    },
    // {
    //     path: 'dashboard2',
    //     component: AdminLayoutComponent,
    //     canActivate: [AuthGuard],
    //     children: [{
    //         path: '',
    //         loadChildren: './dashboard/dashboard.module#DashboardModule'
    //     },
    //     {
    //         path: 'branch',
    //         loadChildren: './branch/branch.module#BranchModule',
    //     },
    //     {
    //         path: 'user',
    //         loadChildren: './user/user.module#UserModule',
    //     }
    // ]
    // },
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    }, {
        path: '',
        component: AdminLayoutComponent,
        children: [{
            path: 'reports',
            loadChildren: './reports/reports.module#ReportsModule'
        }, {
            path: '',
            loadChildren: './dashboard/dashboard.module#DashboardModule'
        }, {
            path: 'components',
            loadChildren: './components/components.module#ComponentsModule'
        }, {
            path: 'forms',
            loadChildren: './forms/forms.module#Forms'
        }, {
            path: 'tables',
            loadChildren: './tables/tables.module#TablesModule'
        }, {
            path: 'maps',
            loadChildren: './maps/maps.module#MapsModule'
        }, {
            path: 'charts',
            loadChildren: './charts/charts.module#ChartsModule'
        }, {
            path: 'calendar',
            loadChildren: './calendar/calendar.module#CalendarModule'
        }, {
            path: '',
            loadChildren: './userpage/user.module#UserModule'
        }, {
            path: '',
            loadChildren: './timeline/timeline.module#TimelineModule'
        }, {
            path: '',
            loadChildren: './widgets/widgets.module#WidgetsModule'
        }]
        }, {
            path: '',
            component: AuthLayoutComponent,
            children: [{
                path: 'pages',
                loadChildren: './pages/pages.module#PagesModule'
            }]
        }
];
