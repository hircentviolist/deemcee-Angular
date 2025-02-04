import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LicenseeService } from '../licensee.service';
import { DataForSelect } from 'app/model/data-for-select';
import { Observable, Subscription } from 'rxjs';
import { UserService } from 'app/user/user.service';
import { STATES } from 'app/resource/states';
import {PrincipalListItem} from '../../../model/principal-list-item';

@Component({
  selector: 'app-add',
  templateUrl: '../shared/branch-form.html',
  styleUrls: ['../shared/branch-form.css']
})
export class AddComponent implements OnInit, OnDestroy {

  branchForm: FormGroup;
  action = 'Add';
  submitted = false;
  selectPrincipalData: Observable<PrincipalListItem[]>;
  branchGrades:any;
  principals = [];
  // hqOwned$$: Subscription;
  states: string[];

  constructor(
    private route: ActivatedRoute,
    private licenseeService: LicenseeService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {

    this.initializeForm();
    // this.listenToOwnershipType();
    this.states = STATES;

    this.selectPrincipalData = this.userService.getPrincipalForSelect();
    this.selectPrincipalData.subscribe(principals => {
      principals.map(principal => {
        if (principal.terminated_at === null) {
          this.principals.push(principal);
        }
      });
    });

    this.licenseeService.getBranchGradeList().subscribe(grades => {
      this.branchGrades = grades;
    }, err => {
      console.log(err)
    });


  }

  initializeForm() {
    this.branchForm = new FormGroup({
      // ownership_type: new FormControl('', Validators.required),
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

  // listenToOwnershipType() {
  //   this.hqOwned$$ =
  //   this.branchForm.get('ownership_type')
  //   .valueChanges
  //   .subscribe(
  //     change => {
  //       if (change === 'HQ') {
  //         this.branchForm.get('principal_id').setValue(1);
  //         console.log(this.branchForm.value);
  //       }
  //     }
  //   )
  // }

  onSelect(e) {
    if (e.target.value === 'create') {
      this.router.navigate(['hq', 'user', 'principal', 'add']);
    }
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.branchForm.value);
    if (!this.branchForm.valid) {
      return;
    }
    const body = this.branchForm.value;
    console.log('operation_date: ', this.branchForm.get('operation_date').value);
    console.log('operation_date, converted: ', this.convertDatePickerFormatForSubmit(this.branchForm.get('operation_date').value));
    body.operation_date = this.convertDatePickerFormatForSubmit(this.branchForm.get('operation_date').value)
    this.licenseeService.createBranch(body)
    .subscribe(
      res => this.router.navigate(['../list'], {relativeTo: this.route}),
      err => {
        alert('Unable to Add' + err?.message);
        console.error(err);
      }
    )
  }

  convertDatePickerFormatForSubmit(date: {year: number, month: number, day: number}) {
    // Converts {year: 2020, month: 10, day: 25} to 2020-10-25 for submit to server
    console.log('convertDatePickerFormatForSubmit, year: ', date.year);
    console.log('convertDatePickerFormatForSubmit, month: ', date.month);
    console.log('convertDatePickerFormatForSubmit, day: ', date.day);
    return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
  }

  ngOnDestroy() {
    // this.hqOwned$$.unsubscribe()
  }

}
