import { Component, OnInit, OnChanges, SimpleChanges, Input, AfterViewInit } from '@angular/core';
import { TitleService } from 'app/shared/title.service';
import { ModuleControlService } from 'app/shared/module-control.service';
import { AuthService } from 'app/auth/auth.service';
import { take, switchMap } from 'rxjs/operators';
import { DataForDataTable } from 'app/model/data-for-data-table';
import { UserService } from '../user.service';
import { of, EMPTY, Observable, Subscription } from 'rxjs';
import { UserPermission } from 'app/model/user-permission';
import {ActivatedRoute, Router} from '@angular/router';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { DataForSelect } from 'app/model/data-for-select';
import { DefaultBranchService } from 'app/default-branch.service';

declare var $: any;

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

@Component({
    moduleId: module.id,
    selector: 'app-user-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {
    public dataTable: DataTable;
    table;
    title;
    authorization: UserPermission[];
    active: number;
    data: DataForDataTable;
    tabId: number;
    branch_id: number;
    branch$: Observable<DataForSelect[]>;
    defaultBranch$$: Subscription;
    search: string = '';
    timer: any;

    constructor(
      private licenseeService: LicenseeService,
      private defaultBranchService: DefaultBranchService,
      private moduleControlService: ModuleControlService,
      private authService: AuthService,
      private userService: UserService,
      private router: Router,
      private route: ActivatedRoute,
      private titleService: TitleService) {
        authService.credential$
        .pipe(
          take(1)
        )
        .subscribe(
          auth => this.authorization = this.moduleControlService.getAuthorization(auth.role)
        );
    }

    ngOnInit() {

      this.title = 'User Management';
      this.titleService.postTitle(this.title);
      this.tabId = +this.route.snapshot.queryParamMap.get('tabId');

      this.branch$ = this.branch$ = this.licenseeService.getBranchForSelect();
      this.defaultBranch$$ = this.defaultBranchService.defaultBranch$
        .subscribe(branch_id => {
          if (branch_id) {
            this.branch_id = branch_id;
            this.active = this.tabId ? this.tabId : 0;
            this.onChangeTable(this.active);
          }
        });

      this.route.queryParams.subscribe(params => {
        if (params.tabId) {
          this.tabId = isNaN(params.tabId) ? 1 : Number(params.tabId);
          this.onChangeTable(this.tabId);
        }
      })

      // Fetch list from server according to dataType eg. superadmin, admin, principals ....


    }

    onChangeTable(tab: number) {

      if (tab === null || !this.branch_id) {
        return;
      }

      this.tabId = tab;
      this.data = null;

      this.router.navigate([], {
        queryParams: {
          tabId: this.tabId
        },
        queryParamsHandling: 'merge',
      });
      this.getData();
  }

  getData() {
    console.log('this',this)
    const userType = this.authorization[this.tabId]['value'];

    of(userType)
    .pipe(
      switchMap(u => {
        switch (u) {
          case 'superadmin':
            return this.userService.getAllSuperAdmins();
          case 'admin':
            return this.userService.getAllAdmins();
          case 'principal':
            return this.userService.getAllPrincipals(this.branch_id);
          case 'manager':
            return this.userService.getAllManagers(this.branch_id);
          case 'teacher':
            return this.userService.getAllTeachers(this.branch_id);
          case 'parent':
            return this.userService.getAllParents(this.branch_id, this.search);
          default:
            return EMPTY;
        }
      })
    ).subscribe(
      data => this.data = data,
      error => {
        console.error(error);
        alert(`Unable to fetch ${userType} list`);
      }
    )
  }

  onValueChange() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.getData();
    }, 350);
  }
}
