import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as faker from 'faker';
import { UserService } from 'app/user/user.service';
import { ModuleControlService } from 'app/shared/module-control.service';
import { AuthService } from 'app/auth/auth.service';
import { map, tap, take } from 'rxjs/operators';
@Component({
  selector: 'app-principal-form',
  templateUrl: '../../shared/principal-form/principal-form.component.html',
  styleUrls: ['../../shared/principal-form/principal-form.component.css']
})
export class PrincipalFormComponent implements OnInit {

  principalForm: FormGroup;
  @Input() userType: string;
  @Input() action: 'add' | 'update';
  submitted = false;
  role: string;
  redirectTabId: number;
  id: string;
  terminated: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private moduleControlService: ModuleControlService,
    private authService: AuthService,
    private userService: UserService) {
      this.authService.credential$
      .pipe(
        map(auth => auth.role),
        take(1)
      ).subscribe(
        role => this.role = role
      );
    }

  ngOnInit(): void {
    this.initializeForm();

    this.id = this.route.snapshot.paramMap.get('id');

    if (this.action === 'update') {
      this.populateForm()
    }

    if (this.role) {
      this.redirectTabId = this.moduleControlService.getAuthorization(this.role).map(aut => aut.value).indexOf(this.userType);
    }
  }

  initializeForm() {
    this.principalForm = new FormGroup({ // Add regex for deemcee only
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      personal_email: new FormControl('', [Validators.email]),
      phone: new FormControl('', Validators.required),
    })
  }

  populateForm() {
    this.userService.getOnePrincipal(this.id)
      .pipe(
        take(1),
        tap(console.log)
      ).subscribe(
        data => {
          this.principalForm.setValue({
            first_name: data.last_name ? data.first_name + ' ' + data.last_name : data.first_name,
          last_name: '',
          email: data.email,
          personal_email: data.personal_email,
          phone: data.phone
        });
        this.terminated = data.terminated_at;
        },
        err => {
          alert('Unable to get ' + this.userType);
          this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}})
        }
      )
  }

  onSubmit() {
    this.submitted = true;
    if (!this.principalForm.valid) {
      return
    }
    if (this.action === 'add') {
      const body = this.principalForm.value;
      body.first_name = body.first_name.trim();
      this.userService.createPrincipal(body)
      .subscribe(
        resp => this.router.navigate(['../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}}),
        error => {
          console.error(error);
          alert(`Unable to ${this.action}. ${JSON.stringify(error.error)}`);
        }
      )
    }
    if (this.action === 'update') {
      const body = this.principalForm.value;
      body.first_name = body.first_name.trim();
      this.userService.updatePrincipal(body, this.id)
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
