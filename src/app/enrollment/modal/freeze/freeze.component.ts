import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-freeze',
  templateUrl: './freeze.component.html',
  styleUrls: ['./freeze.component.css']
})
export class FreezeComponent implements OnInit {

  @Input() data: {isUnfreeze: boolean};
  months = new Array(3);
  selectedMonth: number;
  freezeForm: FormGroup;
  submitted = false;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.freezeForm = new FormGroup({
      // 'number_of_months': new FormControl(''),
      'start_date': new FormControl(''),
      'end_date': new FormControl(''),
    })
  }

  onSelect(e) {
    if (!e.target.value) {
      return;
    }
    this.selectedMonth = +e.target.value;
    console.log('onSelect: ', this.selectedMonth);
  }

  freeze() {
    // console.log('selectedMonth: ', selectedMonth);
    // this.freezeForm.get('number_of_months').setValue(selectedMonth);
    this.freezeForm.get('start_date').setValue(this.convertDatePickerFormatForSubmit(this.freezeForm.get('start_date').value));
    this.freezeForm.get('end_date').setValue(this.convertDatePickerFormatForSubmit(this.freezeForm.get('end_date').value));
    console.log('this.freezeForm: ', this.freezeForm.value);
    this.activeModal.close(this.freezeForm.value);
  }

  convertDatePickerFormatForSubmit(date: {year: number, month: number, day: number}) {
    // Converts {year: 2020, month: 10, day: 25} to 2020-10-25 for submit to server
    console.log('convertDatePickerFormatForSubmit, year: ', date.year);
    console.log('convertDatePickerFormatForSubmit, month: ', date.month);
    console.log('convertDatePickerFormatForSubmit, day: ', date.day);
    return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
  }
}
