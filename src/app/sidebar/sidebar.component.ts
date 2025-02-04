import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { AuthService } from 'app/auth/auth.service';
import { map, tap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { Credentials } from 'app/model/credentials';
import { ModuleControlService } from 'app/shared/module-control.service';

// Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    collapse?: string;
    icontype: string;
    // icon: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

// Permission
const superadmin = [
    'Branches',
    'User Management',
    'Class Record',
    'Merchandise',
    'Video Assignment',
    'Reports',
    'Events',
    'D Points',
    'Structure',
    'Notification',
    'Announcement',
    'Promo Code',
    'Certificate',
];

const admin = [
    'Branches',
    'User Management',
    'Class Record',
    'Merchandise',
    'Video Assignment',
    'Reports',
    'Events',
    'D Points',
    'Structure',
    'Notification',
    'Announcement',
    'Promo Code',
    'Certificate',
];

const principal = [
    'User Management',
    'Class Record',
    'Merchandise',
    'Video Assignment',
    'Reports',
    'Events',
    'D Points',
    'Certificate',
];

const manager = [
    'User Management',
    'Class Record',
    'Merchandise',
    'Video Assignment',
    'Events',
    'D Points',
    'Certificate',
];

const teacher = [
    'User Management',
    'Events',
];

const parent = [];

// Menu Items
export const ROUTES: RouteInfo[] = [{
        path: '/branch',
        title: 'Branches',
        type: 'link',
        icontype: 'nc-icon nc-shop'
    }, {
        path: '../user',
        title: 'User Management',
        type: 'link',
        icontype: 'nc-icon nc-single-02'
    }, {
        path: '/dashboard',
        title: 'Events',
        type: 'link',
        icontype: 'nc-icon nc-calendar-60'
    }, {
        path: '/dashboard',
        title: 'Class Record',
        type: 'link',
        icontype: 'nc-icon nc-single-copy-04'
    }, {
        path: '/dashboard',
        title: 'Merchandise',
        type: 'link',
        icontype: 'nc-icon nc-bag-16'
    }, {
        path: '/dashboard',
        title: 'Video Assignment',
        type: 'link',
        icontype: 'nc-icon nc-button-play'
    }, {
        path: '/dashboard',
        title: 'Reports',
        type: 'link',
        icontype: 'nc-icon nc-chart-bar-32'
    }, {
        path: '/dashboard',
        title: 'D Points',
        type: 'link',
        icontype: 'nc-icon nc-tag-content'
    }, {
        path: '/dashboard',
        title: 'Structure',
        type: 'link',
        icontype: 'nc-icon nc-paper'
    }, {
        path: '/dashboard',
        title: 'Notification',
        type: 'link',
        icontype: 'nc-icon nc-bell-55'
    }, {
        path: '/dashboard',
        title: 'Promo Code',
        type: 'link',
        icontype: 'nc-icon nc-money-coins'
    }, {
        path: '/dashboard',
        title: 'Certificate',
        type: 'link',
        icontype: 'nc-icon nc-trophy'
    },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent {
    public menuItems: any[];
    public credential$: Observable<Credentials>

    permission$$: Subscription;

    constructor(
        private authService: AuthService,
        private moduleControlService: ModuleControlService,
        private router: Router) {
    }

    isNotMobileMenu() {
        if ( window.outerWidth > 991) {
            return false;
        }
        return true;
    }

    ngOnInit() {

        this.credential$ = this.authService.credential$.pipe(tap(console.log))

        this.menuItems = this.moduleControlService.getModules();
        console.log('modules fetched');
        console.log(this.menuItems);

    }

    onLogout() {
        this.authService.logout();
        this.router.navigate(['/auth', 'login'])
    }

    ngAfterViewInit() {
    }
}
