import { Injectable } from '@angular/core';
import { RouteInfo } from 'app/sidebar/sidebar.component';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, EMPTY } from 'rxjs';
import { AuthService } from 'app/auth/auth.service';
import { take, map, tap, takeUntil, startWith } from 'rxjs/operators';
import { UserPermission } from 'app/model/user-permission';

@Injectable({
  providedIn: 'root'
})
export class ModuleControlService {

  private menuItems: RouteInfo[];

// User Permission
superadmin_User_Permission: UserPermission[] = [
  {display: 'SuperAdmin', value: 'superadmin', path: 'superadmin'},
  {display: 'Admin', value: 'admin', path: 'admin'},
  {display: 'Principal', value: 'principal', path: 'principal'},
  {display: 'Manager', value: 'manager', path: 'manager'},
  {display: 'Teacher', value: 'teacher', path: 'teacher'},
  {display: 'Parent', value: 'parent', path: 'parent'},
];

admin_User_Permission = [
  {display: 'Admin', value: 'admin', path: 'admin'},
  {display: 'Principal', value: 'principal', path: 'principal'},
  {display: 'Manager', value: 'manager', path: 'manager'},
  {display: 'Teacher', value: 'teacher', path: 'teacher'},
  {display: 'Parent', value: 'parent', path: 'parent'},
];

principal_User_Permission = [
  {display: 'Manager', value: 'manager', path: 'manager'},
  {display: 'Teacher', value: 'teacher', path: 'teacher'},
  {display: 'Parent', value: 'parent', path: 'parent'},
];

manager_User_Permission = [
  {display: 'Teacher', value: 'teacher', path: 'teacher'},
  {display: 'Parent', value: 'parent', path: 'parent'},
];

teacher_User_Permission = [
];

parent_User_Permission = [];

// Module Permission
superadmin = [
  'Dashboard',
  'Branches',
  'User Management',
  'Structure',
  'Calendar',
  'Classes',
  'Enrollment',
  'Merchandise',
  'Merchandise Sales',
  'Reports',
  'D Points',
  'Notification',
  'Announcement',
  'Promo Code',
  'Certificate',
];

admin = [
  'Dashboard',
  'Branches',
  'User Management',
  'Structure',
  'Calendar',
  'Classes',
  'Enrollment',
  'Merchandise',
  'Merchandise Sales',
  'Reports',
  'D Points',
  'Notification',
  'Announcement',
  'Promo Code',
  'Certificate',
];

principal = [
  'Dashboard',
  'User Management',
  'Calendar',
  'Classes',
  'Enrollment',
  'Merchandise',
  'Merchandise Sales',
  'Reports',
  'D Points',
  'Certificate',
];

manager = [
  'Dashboard',
  'User Management',
  'Calendar',
  'Classes',
  'Enrollment',
  'Merchandise',
  'Merchandise Sales',
  'D Points',
  'Certificate',
];

teacher = [
  'Dashboard',
  'Calendar',
  'Enrollment',
];

parent = [];

ROUTES: RouteInfo[] = [{
  path: 'menu',
  title: 'Dashboard',
  type: 'link',
  icontype: 'nc-icon nc-bank'
}, {
  path: 'branch',
  title: 'Branches',
  type: 'link',
  icontype: 'nc-icon nc-shop'
}, {
  path: 'user',
  title: 'User Management',
  type: 'link',
  icontype: 'nc-icon nc-single-02'
}, {
  path: 'structure',
  title: 'Structure',
  type: 'link',
  icontype: 'nc-icon nc-paper'
},
{
  path: 'calendar',
  title: 'Calendar',
  type: 'link',
  icontype: 'nc-icon nc-calendar-60'
},
{
  path: 'class',
  title: 'Classes',
  type: 'link',
  icontype: 'nc-icon nc-hat-3'
}, {
  path: 'enrollment',
  title: 'Enrollment',
  type: 'link',
  icontype: 'nc-icon nc-single-copy-04'
}, {
  path: 'merchandise',
  title: 'Merchandise',
  type: 'link',
  icontype: 'nc-icon nc-bag-16'
}, {
  path: 'sales',
  title: 'Merchandise Sales',
  type: 'link',
  icontype: 'nc-icon nc-bag-16'
}, {
  path: 'reports',
  title: 'Reports',
  type: 'link',
  icontype: 'nc-icon nc-chart-bar-32'
}, {
  path: 'dpoints',
  title: 'D Points',
  type: 'link',
  icontype: 'nc-icon nc-tag-content'
}, {
  path: 'notification',
  title: 'Notification',
  type: 'link',
  icontype: 'nc-icon nc-bell-55'
}, {
    path: 'announcement',
    title: 'Announcement',
    type: 'link',
    icontype: 'nc-icon nc-chat-33'
  }, {
    path: 'promocode',
    title: 'Promo Code',
    type: 'link',
    icontype: 'nc-icon nc-money-coins'
  }, {
    path: 'certificate',
    title: 'Certificate',
    type: 'link',
    icontype: 'nc-icon nc-trophy'
  },
];

role: string;


  constructor(private router: Router, private authService: AuthService) {
    authService.credential$
    .pipe(
      takeUntil(EMPTY)
    ).subscribe(auth => {
      if (auth) {
        this.role = auth.role;
      } else {
        this.role = '';
      }
    })
  }

  getModules(): RouteInfo[] {

    this.ROUTES = this.ROUTES.filter(r => (!!r.path && r.type === 'link'));
    console.log('getModules: ', this.ROUTES);
    switch (this.role) {
      case 'superadmin':
        return this.ROUTES.filter(r => {
          console.log('getModules, superadmin: ', this.superadmin.includes(r.title));
          return this.superadmin.includes(r.title);
        });

      case 'admin':
        return this.ROUTES.filter(r => {
          console.log('getModules, admin: ', this.admin.includes(r.title));
          return this.admin.includes(r.title);
        });

      case 'principal':
        return this.ROUTES.filter(r => {
          console.log('getModules, principal: ', this.principal.includes(r.title));
          return this.principal.includes(r.title);
        });

      case 'manager':
        return this.ROUTES.filter(r => {
          console.log('getModules, manager: ', this.manager.includes(r.title));
          return this.manager.includes(r.title);
        });

      case 'teacher':
        return this.ROUTES.filter(r => {
          console.log('getModules, teacher: ', this.teacher.includes(r.title));
          return this.teacher.includes(r.title);
        });

      case 'parent':
        return this.ROUTES.filter(r => {
          console.log('getModules, teacher: ', this.teacher.includes(r.title));
          return this.teacher.includes(r.title);
        });
      default:
        return [];
    }

  }


  getAuthorization(role): UserPermission[] {
    switch (role) {
      case 'superadmin':
          return this.superadmin_User_Permission;
      break;

      case 'admin':
          return this.admin_User_Permission;
      break;

      case 'principal':
          return this.principal_User_Permission;
      break;

      case 'manager':
          return this.manager_User_Permission;
      break;

      case 'teacher':
          return this.teacher_User_Permission;
      break;

      case 'parent':
          return this.parent_User_Permission;
      break;
    }
  }


}
