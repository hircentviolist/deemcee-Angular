import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as faker from 'faker';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'app/user/user.service';
import { DataForSelect } from 'app/model/data-for-select';
import { AuthService } from 'app/auth/auth.service';
import { Observable, Subscription, EMPTY } from 'rxjs';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { take, distinctUntilChanged, switchMap, tap, debounce, debounceTime } from 'rxjs/operators';
import { ModuleControlService } from 'app/shared/module-control.service';
import { STATES } from 'app/constant/states';
import { BANKS } from 'app/constant/banks';
import { GetOneManagerDto } from 'app/model/get-one-manager-dto';
@Component({
  selector: 'app-manager-teacher-form',
  templateUrl: './manager-teacher-form.component.html',
  styleUrls: ['./manager-teacher-form.component.css']
})
export class ManagerTeacherFormComponent implements OnInit, OnDestroy {

  managerTeacherForm: FormGroup;
  @Input() userType: string;
  @Input() action: 'add' | 'update';
  submitted = false;
  id: string;
  selectBranchData: DataForSelect[];
  role: string;
  redirectTabId: number;
  states: DataForSelect[];
  banks: DataForSelect[];
  grades$: Observable<DataForSelect>;
  email$$: Subscription;
  branches: {branch_id: number; name: string; checked: boolean}[] = [];
  unEditableBranches: {branch_id: number}[] = [];
  isDuplicate: {email: string, id: number};
  isLoading = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private licenseeService: LicenseeService,
    private moduleControlService: ModuleControlService,
    private route: ActivatedRoute) {
      authService.credential$
      .pipe(
        take(1)
      )
      .subscribe(
        resp => this.role = resp.role
      );
    }

  ngOnInit(): void {

    this.states = STATES;
    this.banks = BANKS;
    this.grades$ = this.userService.getGradesList(this.userType);

    this.initializeForm();

    if (this.action === 'update') {
      this.id = this.route.snapshot.paramMap.get('id');
      this.populateForm()
    }

    this.licenseeService.getBranchForSelect()
    .pipe(
      take(1)
    ).subscribe(
      data => this.branches = data.map(b => {
        return {branch_id: b.id, name: b.name, checked: false}
      }),
      error => `Cannot fetch Branches. ${JSON.stringify(error.error)}`
    );
    // TODO: Only Super Admin and Admin can change grade_ids

    if (this.role) {
      this.redirectTabId = this.moduleControlService.getAuthorization(this.role).map(aut => aut.value).indexOf(this.userType);
    }

    if (this.action === 'add') {
      // If email already exist in system, prompt and auto populate
      this.checkForDuplicate();
    }
  }

  checkForDuplicate() {
    this.email$$ =
    this.managerTeacherForm.get('email').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap(email => {
        if (this.managerTeacherForm.get('email').valid) {
          if (this.userType === 'manager') {
            return this.userService.getManagerByEmail(email);
          }
          if (this.userType === 'teacher') {
            return this.userService.getTeacherByEmail(email);
          }
        } else {
          return EMPTY;
        }
      }),
      tap(user => {
          this.managerTeacherForm.setValue({
            first_name: user.last_name ? user.first_name + ' ' + user.last_name : user.first_name,
            last_name: '',
            email: user.email,
            phone: user.phone,
            dob: this.convertToDatePickerFormat(user.dob),
            ic_number: user.ic_number,
            branch_id: '',
            branches: user.branches,
            bank_name: user.bank_name,
            bank_account_name: user.bank_account_name,
            bank_account_number: user.bank_account_number,
            grade_id: user.grade_id,
            address: {
              address_line_1: user.address.address_line_1,
              address_line_2: user.address.address_line_2,
              address_line_3: user.address.address_line_3,
              city: user.address.city,
              postcode: user.address.postcode,
              state: user.address.state,
            }
          });
          this.populateBranches(user);
          this.id = user.id.toString();
          this.isDuplicate = {id: user.id, email: user.email};
          alert(`The ${this.userType} is found. Just assign branch.`)
      })
    )
    .subscribe()
  }

  initializeForm() {
    this.managerTeacherForm = new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl(''),
      email: new FormControl('', [Validators.required,
        Validators.email, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      phone: new FormControl('', [Validators.required]),
      dob: new FormControl('', Validators.required),
      ic_number: new FormControl('', Validators.required),
      branch_id: new FormControl(''),
      branches: new FormControl(''),
      bank_name: new FormControl(''),
      bank_account_name: new FormControl(''),
      bank_account_number: new FormControl(''),
      grade_id: new FormControl({value: '', disabled: (this.role !== 'admin' && this.role !== 'superadmin')}),
      address: new FormGroup({
        address_line_1: new FormControl('', Validators.required),
        address_line_2: new FormControl(''),
        address_line_3: new FormControl(''),
        city: new FormControl('', Validators.required),
        postcode: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
      }),
    });

    // Default grade when teacher/manager added is Newbie. Only Admin and SuperAdmin can change.
    if (this.action === 'add') {
      if (this.userType === 'manager') {
        this.managerTeacherForm.get('grade_id').setValue(3);
      } else {
        this.managerTeacherForm.get('grade_id').setValue(1);
      }
    }

    if (this.role) {
      this.redirectTabId = this.moduleControlService.getAuthorization(this.role).map(aut => aut.value).indexOf(this.userType);
      if (this.role !== 'admin' && this.role !== 'superadmin') {
        this.managerTeacherForm.get('grade_id').setValidators(Validators.required);
      } else {
        this.managerTeacherForm.get('grade_id').clearValidators();
      }
    }

    // Admin, SuperAdmin, Principal with more than one branch needs to specify which branch is this created for
  }

  populateForm() {

    if (this.userType === 'manager') {
      this.userService.getOneManager(this.id)
      .pipe(
        take(1)
      )
      .subscribe(data => {
        this.managerTeacherForm.setValue({
          first_name: data.last_name ? data.first_name + ' ' + data.last_name : data.first_name,
          last_name: '',
          email: data.email,
          phone: data.phone,
          dob: this.convertToDatePickerFormat(data.dob),
          ic_number: data.ic_number,
          branch_id: '',
          branches: data.branches,
          bank_name: data.bank_name,
          bank_account_name: data.bank_account_name,
          bank_account_number: data.bank_account_number,
          grade_id: data.grade_id,
          address: data?.address ? {
            address_line_1: data?.address?.address_line_1,
            address_line_2: data?.address?.address_line_2,
            address_line_3: data?.address?.address_line_3,
            city: data?.address?.city,
            postcode: data?.address?.postcode,
            state: data?.address?.state,
          } : {
            address_line_1: '',
            address_line_2: '',
            address_line_3: '',
            city: '',
            postcode: '',
            state: '',
          }
        });
        this.populateBranches(data)
      },
      err => {
        alert('Unable to retrieve ' + this.userType);
        this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}});
      })
    }

    if (this.userType === 'teacher') {
      this.userService.getOneTeacher(this.id)
      .pipe(
        take(1)
      )
      .subscribe(data => {
        this.managerTeacherForm.setValue({
          first_name: data.last_name ? data.first_name + ' ' + data.last_name : data.first_name,
          last_name: '',
          email: data.email,
          phone: data.phone,
          dob: this.convertToDatePickerFormat(data.dob),
          ic_number: data.ic_number,
          branch_id: '',
          branches: data.branches,
          bank_name: data.bank_name,
          bank_account_name: data.bank_account_number,
          bank_account_number: data.bank_account_number,
          grade_id: data.grade_id,
          address: data?.address ? {
            address_line_1: data?.address?.address_line_1,
            address_line_2: data?.address?.address_line_2,
            address_line_3: data?.address?.address_line_3,
            city: data?.address?.city,
            postcode: data?.address?.postcode,
            state: data?.address?.state,
          } : {
            address_line_1: '',
            address_line_2: '',
            address_line_3: '',
            city: '',
            postcode: '',
            state: '',
          }
        });
        this.populateBranches(data);
      },
      err => {
        alert('Unable to retrieve ' + this.userType);
        this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}});
      })
    }
  }

  onSubmit() {

    this.submitted = true;

    if (this.managerTeacherForm.invalid) {
      console.log(this.managerTeacherForm);
      return;
    }

    const body = this.managerTeacherForm.value;
    body.first_name = body.first_name.trim();
    console.log('onSubmit: ', this.managerTeacherForm.value);
    if (this.role !== 'admin' && this.role !== 'superadmin') {
      if (this.userType === 'manager') {
        body.grade_id = 3;
      } else {
        body.grade_id = 1;
      }
    }
    body.dob = this.convertDatePickerFormatForSubmit(body.dob);
    // body.branch_id = 1;
    body.branches =
    this.branches
    .filter(b => b.checked)
    .map(b => {
      return {branch_id: b.branch_id}
    }).concat(this.unEditableBranches);

    console.log('onSubmit: ', this.managerTeacherForm.value);

    this.isLoading = true;
    if (this.isDuplicate?.email === body.email && this.userType === 'teacher') {
      this.userService.updateTeacher(body, this.isDuplicate.id.toString())
      .pipe(
        take(1)
      ).subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate(['../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}});
        },
        error => {
          this.isLoading = false;
          console.error(error);
          alert(`Unable to update ${this.userType}. ${JSON.stringify(error.error.errors)}`)
          body.dob = this.convertToDatePickerFormat(body.dob);
        }
      );
      return;
    }

    if (this.isDuplicate?.email === body.email && this.userType === 'manager') {
      this.userService.updateManager(body, this.isDuplicate.id.toString())
      .pipe(
        take(1)
      ).subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate(['../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}})
        },
        error => {
          this.isLoading = false;
          console.error(error);
          alert(`Unable to update ${this.userType}. ${JSON.stringify(error.error.errors)}`)
          body.dob = this.convertToDatePickerFormat(body.dob);
        }
      );
      return;
    }


    if (this.action === 'add' && this.userType === 'teacher') {
      this.userService.createTeacher(body)
      .subscribe(
        resp => {
          this.isLoading = false;
          this.router.navigate(['../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}})
        },
        error => {
          this.isLoading = false;
          console.error(error);
          alert(`Unable to ${this.action} ${this.userType}. ${JSON.stringify(error.error.errors)}`)
          body.dob = this.convertToDatePickerFormat(body.dob);
        }
      )
    }

    if (this.action === 'add' && this.userType === 'manager') {
      this.userService.createManager(body)
      .subscribe(
        resp => {
          this.isLoading = false;
          this.router.navigate(['../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}})
        },
        error => {
          this.isLoading = false;
          console.error(error);
          alert(`Unable to ${this.action} ${this.userType}. ${JSON.stringify(error.error.errors)}`)
          body.dob = this.convertToDatePickerFormat(body.dob);
        }
      )
    }
    if (this.action === 'update' && this.userType === 'teacher') {
      this.userService.updateTeacher(body, this.id)
      .pipe(
        take(1)
      ).subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}})
        },
        error => {
          this.isLoading = false;
          console.error(error);
          alert(`Unable to update ${this.userType}. ${JSON.stringify(error.error.errors)}`)
          body.dob = this.convertToDatePickerFormat(body.dob);
        }
      );
      this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}})
      // this.userService.updateTeacher(this.managerTeacherForm.value, this.id);
    }

    if (this.action === 'update' && this.userType === 'manager') {
      this.userService.updateManager(body, this.id)
      .pipe(
        take(1)
      ).subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}})
        },
        error => {
          this.isLoading = false;
          console.error(error);
          alert(`Unable to update ${this.userType}. ${JSON.stringify(error.error.errors)}`)
          body.dob = this.convertToDatePickerFormat(body.dob);
        }
      );
      this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}})
      // this.userService.updateTeacher(this.managerTeacherForm.value, this.id);
    }
  }

  convertToDatePickerFormat(date: string) {
    // Converts 2020-10-25 to {year: 2020, month: 10, day: 25} for datepicker use

    const dateArray = date.split('-');
    return {
      year: +dateArray[0],
      month: +dateArray[1],
      day: +dateArray[2],
    }
  }

  convertDatePickerFormatForSubmit(date: {year: number, month: number, day: number}) {
    // Converts {year: 2020, month: 10, day: 25} to 2020-10-25 for submit to server
    return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
  }

  onChangeBranch(e) {
    console.log(e);
    const branchArray = this.branches.map(b => b.branch_id).indexOf(+e.target.value);
    console.log(branchArray);
    this.branches[branchArray].checked = e.target.checked;
    console.log(this.branches);
  }

  populateBranches(data: GetOneManagerDto) {
    data.branches.forEach((el, i) => {
      const branchArray = this.branches.map(b => b.branch_id).indexOf(el.id);
      if (branchArray > -1) {
        this.branches[branchArray].checked = true;
      } else {
        this.unEditableBranches.push({branch_id: el.id})
      }
    })
  }

  ngOnDestroy() {
    if (this.email$$) {
      this.email$$.unsubscribe();
    }
  }

}
