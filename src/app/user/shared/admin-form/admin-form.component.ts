import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as faker from 'faker';
import { UserService } from 'app/user/user.service';
import { ModuleControlService } from 'app/shared/module-control.service';
import { AuthService } from 'app/auth/auth.service';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.css']
})
export class AdminFormComponent implements OnInit {

  adminForm: FormGroup;
  @Input() userType: string;
  @Input() action: 'add' | 'update';
  submitted = false;
  id: string;
  redirectTabId: number;
  role: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private moduleService: ModuleControlService,
    private authService: AuthService,
    private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');

    this.authService.credential$
    .pipe(
      map(auth => auth.role),
      take(1)
    ).subscribe(
      role => this.role = role
    )
  }

  ngOnInit(): void {
    this.initializeForm();

    if (this.action === 'update') {
      this.populateForm()
    }

    if (this.role) {
       this.redirectTabId = this.moduleService.getAuthorization(this.role).map(aut => aut.value).indexOf(this.userType);
    }

  }

  initializeForm() {
    this.adminForm = new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z0-9]+\@deemcee.com/)])
    })
  }

  populateForm() {
    if (this.userType === 'superadmin') {
      this.userService.getOneSuperAdmin(this.id)
      .pipe(
        take(1)
      ).subscribe(
        data => this.adminForm.setValue({
          first_name: data.last_name ? data.first_name + ' ' + data.last_name : data.first_name,
          last_name: '',
          email: data.email,
        }),
        err => {
          alert('Unable to get ' + this.userType);
          this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}})
        }
      )
    }

    if (this.userType === 'admin') {
      this.userService.getOneAdmin(this.id)
      .pipe(
        take(1)
      ).subscribe(
        data => this.adminForm.setValue({
          first_name: data.last_name ? data.first_name + ' ' + data.last_name : data.first_name,
          last_name: '',
          email: data.email,
        }),
        err => {
          alert('Unable to get ' + this.userType);
          this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}})
        }
      )
    }
  }

  onSubmit() {
    console.log(this.adminForm.value)
    this.submitted = true;
    if (this.adminForm.invalid) {
      return;
    }

    console.log('action: ', this.action, 'userType: ', this.userType)

    if (this.action === 'add' && this.userType === 'superadmin') {
      const body = this.adminForm.value;
      body.first_name = body.first_name.trim();
      this.userService.createSuperAdmin(body)
      .subscribe(
        resp => this.router.navigate(['../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}}),
        err => {
          alert(`Unable to add ${this.userType}. ${JSON.stringify(err?.message)}`)
        }
      )
    }
    if (this.action === 'add' && this.userType === 'admin') {
      const body = this.adminForm.value;
      body.first_name = body.first_name.trim();
      this.userService.createAdmin(body)
      .subscribe(
        resp => this.router.navigate(['../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}}),
        err => {
          console.error(err);
          alert(`Unable to add ${this.userType}. ${JSON.stringify(err?.error)}`)
        }
      )
    }
    if (this.action === 'update' && this.userType === 'superadmin') {
      const body = this.adminForm.value;
      body.first_name = body.first_name.trim();
      this.userService.updateSuperAdmin(body, this.id)
      .pipe(
        take(1)
      ).subscribe(
        () => this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}}),
        err => {
          console.error(err)
          alert(`Unable to update ${this.userType}. ${JSON.stringify(err.error)}`)
        }
      )
    }
    if (this.action === 'update' && this.userType === 'admin') {
      const body = this.adminForm.value;
      body.first_name = body.first_name.trim();
      this.userService.updateAdmin(body, this.id)
      .pipe(
        take(1)
      ).subscribe(
        () => this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}}),
        err => {
          console.error(err)
          alert(`Unable to update ${this.userType}. ${JSON.stringify(err.error)}`)
        }
      )
    }
  }

}
