import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { DataForSelect } from 'app/model/data-for-select';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {EnrollmentListItem} from '../../../model/enrollment-list-item';
import {DefaultBranchService} from '../../../default-branch.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {

  @Input() data: {enrolment: EnrollmentListItem};
  transferForm: FormGroup;
  branch$: Observable<DataForSelect[]>;
  branch_id: number;
  submitted = false;
  mappedBranch = [];
  toBranchList$: Observable<DataForSelect[]>;

  constructor(
    private licenseeService: LicenseeService,
    public activeModal: NgbActiveModal,
    private defaultBranchService: DefaultBranchService
  ) { }

  ngOnInit(): void {
    console.log('enrolment: ', this.data.enrolment);
    this.initializeForm();
    this.defaultBranchService.defaultBranch$
      .subscribe(branch_id => {
        if (branch_id) {
          this.branch_id = branch_id;
        }
      });
    this.branch$ =
    this.licenseeService
    .getBranchForSelect()
    .pipe(
      shareReplay()
    );
    this.mappedBranch = [];
    this.branch$.subscribe(branches => {
      branches.map(branch => {
        if (!Object.keys(this.mappedBranch).includes(String(branch.id))) {
          this.mappedBranch[String(branch.id)] = branch;
        }
      });
      console.log('this.mappedBranch: ', this.mappedBranch)
    })

    this.toBranchList$ = this.licenseeService.getBranchForTransferOut();
  }

  initializeForm() {
    this.transferForm = new FormGroup({
      transfer: new FormControl(''),
      from_branch_id: new FormControl(''),
      to_branch_id: new FormControl('', Validators.required),
      start_date: new FormControl('', Validators.required)
    })
  }

  onSubmit() {
    if (!this.transferForm.valid) {
      console.log('transferForm: ', this.transferForm);
      this.submitted = true;
      return;
    }
    this.transferForm.get('from_branch_id').setValue(this.branch_id);
    this.transferForm.get('start_date').setValue(this.convertDatePickerFormatForSubmit(this.transferForm.get('start_date').value));
    this.activeModal.close(this.transferForm.value)
  }

  convertDatePickerFormatForSubmit(date: {year: number, month: number, day: number}) {
    // Converts {year: 2020, month: 10, day: 25} to 2020-10-25 for submit to server
    console.log('convertDatePickerFormatForSubmit, year: ', date.year);
    console.log('convertDatePickerFormatForSubmit, month: ', date.month);
    console.log('convertDatePickerFormatForSubmit, day: ', date.day);
    return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
  }

}
