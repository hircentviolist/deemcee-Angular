import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as faker from 'faker';
import { LicenseeService } from '../licensee.service';
import { take, tap, map } from 'rxjs/operators';
import { DataForSelect } from 'app/model/data-for-select';
import { Observable, Subscription } from 'rxjs';
import { UserService } from 'app/user/user.service';
import { STATES } from 'app/resource/states';
import {PrincipalListItem} from '../../../model/principal-list-item';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-update',
  templateUrl: '../shared/branch-form.html',
  styleUrls: ['../shared/branch-form.css']
})
export class UpdateComponent implements OnInit, OnDestroy {

  branchForm: FormGroup;
  action = 'Update';
  submitted: false;
  id: number;
  selectPrincipalData: Observable<PrincipalListItem[]>;
  principals = [];
  hqOwned$$: Subscription;
  states: string[];

  branchGrades:any;

  constructor(
    private route: ActivatedRoute,
    private licenseeService: LicenseeService,
    private userService: UserService,
    private router: Router) {
      this.id = +this.route.snapshot.paramMap.get('id');
    }

  ngOnInit(): void {

    this.initializeForm();
    this.populateForm();
    this.selectPrincipalData = this.userService.getPrincipalForSelect();
    this.selectPrincipalData.subscribe(principals => {
      principals.map(principal => {
        if (principal.terminated_at === null) {
          this.principals.push(principal);
        }
      });
    });
    this.states = STATES;

    this.licenseeService.getBranchGradeList().subscribe(grades => {
      this.branchGrades = grades;
    }, err => {
      console.log(err)
    });
  }

  initializeForm() {
    this.branchForm = new FormGroup({
      principal_id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      branch_grade_id: new FormControl('', Validators.required),
      operation_date: new FormControl('', Validators.required),
      business_name: new FormControl('', Validators.required),
      business_reg_no: new FormControl('', Validators.required),
      address: new FormGroup({
        address_line_1: new FormControl('', Validators.required),
        address_line_2: new FormControl(''),
        address_line_3: new FormControl(''),
        city: new FormControl('', Validators.required),
        postcode: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
      })
    })
  }

  populateForm() {
    this.licenseeService.getOneBranch(this.id)
    .pipe(
      tap(console.log)
    ).subscribe(
      data => {
        this.branchForm.patchValue({
          principal_id: data.principal_id,
          name: data.name,
          branch_grade_id: data.branch_grade_id,
          operation_date: this.convertToDatePickerFormat(data.operation_date),
          business_name: data.business_name,
          business_reg_no: data.business_reg_no,
        });
        if (data.address) {
          this.branchForm.patchValue({
            address: {
              address_line_1: data.address.address_line_1,
              address_line_2: data.address.address_line_2,
              address_line_3: data.address.address_line_3,
              city: data.address.city,
              postcode: data.address.postcode,
              state: data.address.state
            }
          })
        }
      }
    )
  }

  listenToOwnershipType() {
    this.hqOwned$$ =
    this.branchForm.get('ownership_type')
    .valueChanges
    .subscribe(
      change => {
        if (change === 'HQ') {
          this.branchForm.get('principal_id').setValue(1);
          console.log(this.branchForm.value);
        }
      }
    )
  }

  onSelect(e) {
    if (e.target.value === 'create') {
      this.router.navigate(['hq', 'user', 'principal', 'add']);
    }
  }

  onSubmit() {
    const body = this.branchForm.value;

    body.operation_date = this.convertDatePickerFormatForSubmit(body.operation_date)
    this.licenseeService.updateBranch(this.id, body)
    .pipe(
      take(1)
    ).subscribe(
      () => this.router.navigate(['../../list'], {relativeTo: this.route}),
      err => {
        console.error(err);
        alert(`Unable to update. ${JSON.stringify(err.error)}`)
      }
    )
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
    console.log('convertDatePickerFormatForSubmit, year: ', date.year);
    console.log('convertDatePickerFormatForSubmit, month: ', date.month);
    console.log('convertDatePickerFormatForSubmit, day: ', date.day);
    return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
  }

  onDelete() {
    this.licenseeService.deleteBranch(this.id.toString())
    .subscribe(
      () => this.router.navigate(['../../list'], {relativeTo: this.route}),
      err => {
        console.error(err);
        alert(`Unable to delete branch. ${JSON.stringify(err.errors)}`)
      }
    )
  }

  ngOnDestroy() {
    if (this.hqOwned$$) {
      this.hqOwned$$.unsubscribe();
    }
  }


}
