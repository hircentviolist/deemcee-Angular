import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as faker from 'faker';
import { UserService } from 'app/user/user.service';
import { DataForSelect } from 'app/model/data-for-select';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import {Observable, of} from 'rxjs';
import { AuthService } from 'app/auth/auth.service';
import { ModuleControlService } from 'app/shared/module-control.service';
import { map, take } from 'rxjs/operators';
import {STATES} from '../../../resource/states';
import {Kid} from '../../../model/get-one-parent-dto';
import {EnrollmentService} from '../../../enrollment.service';
@Component({
  selector: 'app-parent-student-form',
  templateUrl: './parent-student-form.component.html',
  styleUrls: ['./parent-student-form.component.css']
})
export class ParentStudentFormComponent implements OnInit {
  parentStudentForm: FormGroup;
  @Input() userType: string;
  @Input() action: 'add' | 'update';
  submitted = false;
  selectBranchData: Observable<DataForSelect[]>;
  referralChannels: {id: number, name: string} [] = [];
  role: string;
  redirectTabId: number;
  id: string;
  state$: Observable<any[]>;
  states = STATES;
  kids: Kid[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private licenseeService: LicenseeService,
    private authService: AuthService,
    private moduleControlService: ModuleControlService,
    private enrollmentService: EnrollmentService,
    private userService: UserService) {
      this.authService.credential$
      .pipe(
        map(auth => auth.role),
        take(1)
      ).subscribe(
        role => this.role = role
      )
    }

  ngOnInit(): void {

    this.state$ = of(STATES);
    this.getReferralChannels();
    this.selectBranchData = this.licenseeService.getBranchForSelect();

    if (this.role) {
      console.log('this.role: ', this.role);
      console.log('this.userType: ', this.userType);
      this.redirectTabId = this.moduleControlService.getAuthorization(this.role).map(aut => aut.value).indexOf(this.userType);
      console.log('this.redirectTabId: ', this.redirectTabId);
    }

    this.initializeForm();
    if (this.action === 'update') {
      this.id = this.route.snapshot.paramMap.get('id');
      this.populateForm()
    }
  }

  getReferralChannels() {
    this.enrollmentService.getReferralChannelList().subscribe(res => {
      console.log('referralChannels: ', res);
      this.referralChannels = res;
    }, err => {
      console.log({err})
    })
  }

  initializeForm() {
    this.parentStudentForm = new FormGroup({
      branch_id: new FormControl('', Validators.required),
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.required),
      dob: new FormControl(null),
      gender: new FormControl('', Validators.required),
      occupation: new FormControl('', Validators.required),
      spouse_name: new FormControl(''),
      spouse_phone: new FormControl(''),
      spouse_occupation: new FormControl(''),
      no_of_children: new FormControl(''),
      address: new FormGroup({
        address_line_1: new FormControl('', Validators.required),
        address_line_2: new FormControl(''),
        address_line_3: new FormControl(''),
        city: new FormControl('', Validators.required),
        postcode: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
      }),
    })
  }

  populateForm() {
    this.userService.getOneParent(this.id)
    .pipe(
      take(1)
    ).subscribe(
      data => {
        this.kids = [];
        console.log(data);
        data.kids.map(kid => {
          switch (kid.deemcee_starting_grade) {
            case '1':
              kid.starting_grade = 'G1';
              break;
            case '2':
              kid.starting_grade = 'G2';
              break;
            case '3':
              kid.starting_grade = 'G3';
              break;
            case '4':
              kid.starting_grade = 'G4';
              break;
            case '5':
              kid.starting_grade = 'G5';
              break;
            case '6':
              kid.starting_grade = 'G6';
              break;
          }
          switch (kid.grade_id) {
            case 1:
              kid.current_grade = 'G1';
              break;
            case 2:
              kid.current_grade = 'G2';
              break;
            case 3:
              kid.current_grade = 'G3';
              break;
            case 4:
              kid.current_grade = 'G4';
              break;
            case 5:
              kid.current_grade = 'G5';
              break;
            case 6:
              kid.current_grade = 'G6';
              break;
          }
          if (this.referralChannels.length) {
            this.referralChannels.map(channel => {
              if (channel.id === kid.referral_channel_id) {
                kid.referral_channel = channel.name;
              }
            })
          }
          kid.status = this.reformatStatus(kid.status);
          this.kids.push(kid);
        });
        this.parentStudentForm.patchValue({
          branch_id: data.branch_id,
          first_name: data.last_name ? data.first_name + ' ' + data.last_name : data.first_name,
          last_name: '',
          email: data.email,
          phone: data.phone,
          dob: data.dob ? this.convertToDatePickerFormat(data.dob) : null,
          gender: data.gender,
          occupation: data.occupation,
          spouse_name: data.spouse_name,
          spouse_phone: data.spouse_phone,
          spouse_occupation: data.spouse_occupation,
          no_of_children: data.no_of_children,
          address: {
            address_line_1: data.address.address_line_1,
            address_line_2: data.address.address_line_2,
            address_line_3: data.address.address_line_3,
            city: data.address.city,
            postcode: data.address.postcode,
            state: data.address.state,
          }
        })
      },
      error => {
        console.error(error.error);
        alert('Parent does not exist. ' + JSON.stringify(error.error));
        this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}});
      }
    )
  }

  reformatStatus(status): string {
    return status.toLowerCase().split('_').map(word => this.capFirstChar(word)).join(' ');
  }

  capFirstChar(word): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  convertDatePickerFormatForSubmit(date: {year: number, month: number, day: number}) {
    // Converts {year: 2020, month: 10, day: 25} to 2020-10-25 for submit to server
    if (date) {
      console.log('convertDatePickerFormatForSubmit, year: ', date.year);
      console.log('convertDatePickerFormatForSubmit, month: ', date.month);
      console.log('convertDatePickerFormatForSubmit, day: ', date.day);
      return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
    } else {
      return '';
    }
  }

  convertToDatePickerFormat(date: string) {
    // Converts 2020-10-25 to {year: 2020, month: 10, day: 25} for datepicker use
    if (date !== '') {
      const dateArray = date.split('-');
      return {
        year: +dateArray[0],
        month: +dateArray[1],
        day: +dateArray[2],
      }
    } else {
      return null;
    }
  }

  onSubmit() {
    console.log(this.action);
    this.parentStudentForm.get('dob').clearValidators();
    this.submitted = true;
    if (!this.parentStudentForm.valid) {
      console.log('invalid form', this.parentStudentForm);
      return;
    }
    // submit to different service for teacher and manager
    if (this.action === 'add') {
      console.log(this.parentStudentForm.value)
      this.userService.createParent(this.parentStudentForm.value)
      .subscribe(
        resp => this.router.navigate(['../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}}),
        err => {
          console.error(err);
          alert(`Unable to ${this.action} ${this.userType}. ${JSON.stringify(err.error)}`)
        }
      )
    }
    if (this.action === 'update') {
      const body = this.parentStudentForm.value;
      body.dob = body.dob ? this.convertDatePickerFormatForSubmit(body.dob) : null;
      this.userService.updateParent(this.parentStudentForm.value, this.id)
      .pipe(
        take(1)
      ).subscribe(
        () => this.router.navigate(['../../../list'], {relativeTo: this.route, queryParams: {tabId: this.redirectTabId}}),
        err => {
          console.error(err);
          this.parentStudentForm.get('dob').patchValue(this.convertToDatePickerFormat(body.dob));
          alert(`Unable to update ${this.userType}. ${JSON.stringify(err.error)}`)
        }
      )
    }
  }


}
