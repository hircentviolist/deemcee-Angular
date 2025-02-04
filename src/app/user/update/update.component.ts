import { Component, OnInit } from '@angular/core';
import { TitleService } from 'app/shared/title.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/auth/auth.service';
import { map, take, switchMap } from 'rxjs/operators';
import { UserService } from '../user.service';
import { ModuleControlService } from 'app/shared/module-control.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  title: string;
  options: Array<{value: string; display: string}>
  userType: string;
  id: string;
  role: string;
  redirectTabId: number;

  constructor(
    private titleService: TitleService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private moduleControlService: ModuleControlService
  ) {
    this.route.paramMap
    .pipe(
      map(param => param.get('userType')),
      take(1)
    ).subscribe(
      u => this.userType = u
    )

    this.authService.credential$
    .pipe(
      map(auth => auth.role),
      take(1)
    ).subscribe(
      role => this.role = role
    )
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.title = `Update ${this.userType}`;
    this.titleService.postTitle(this.title);

    if (this.role) {
      this.redirectTabId = this.moduleControlService.getAuthorization(this.role).map(aut => aut.value).indexOf(this.userType);
    }
  }

  onDelete() {

    switch (this.userType) {
      case 'superadmin':
        this.userService.deleteSuperAdmin(this.id)
        .subscribe(
          () => this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}}),
          err => {
            console.error(err);
            alert(`Unable to delete ${this.userType}. ${JSON.stringify(err.error)}`);
          }
        )
        break

      case 'admin':
        this.userService.deleteAdmin(this.id)
        .subscribe(
          () => this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}}),
          err => {
            console.error(err);
            alert(`Unable to delete ${this.userType}. ${JSON.stringify(err.error)}`);
          }
        )
        break

      case 'principal':
        this.userService.treminatePrincipal(this.id)
        .subscribe(
          () => this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}}),
          err => {
            console.error(err);
            alert(`Unable to delete ${this.userType}. ${JSON.stringify(err.error)}`);
          }
        )
        break

        case 'manager':
          this.userService.deleteManager(this.id)
          .subscribe(
            () => this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}}),
            err => {
              console.error(err);
              alert(`Unable to delete ${this.userType}. ${JSON.stringify(err.error)}`);
            }
          )
          break

          case 'teacher':
            this.userService.deleteTeacher(this.id)
            .subscribe(
              () => this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}}),
              err => {
                console.error(err);
                alert(`Unable to delete ${this.userType}. ${JSON.stringify(err.error)}`);
              }
            )
            break

            case 'parent':
              this.userService.deleteParent(this.id)
              .subscribe(
                () => this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}}),
                err => {
                  console.error(err);
                  alert(`Unable to delete ${this.userType}. ${JSON.stringify(err.error)}`);
                }
              )
              break

          default:
            return
    }

  }

  onSubmit() {
  }

}
