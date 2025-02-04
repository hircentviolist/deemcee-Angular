import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subscription} from 'rxjs';
import {DataForSelect} from '../../../../model/data-for-select';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {CalendarService} from '../../../../calendar/calendar.service';
import {DefaultBranchService} from '../../../../default-branch.service';
import { Grade } from 'app/model/grade';
import { StructureService } from 'app/structure/structure.service';

@Component({
  selector: 'app-transfer-in-details',
  templateUrl: './transfer-in-details.component.html',
  styleUrls: ['./transfer-in-details.component.css']
})
export class TransferInDetailsComponent implements OnInit {

  @Input() data: {student: any};
  transferInForm: FormGroup;
  branch_id: number;
  submitted = false;
  commencementDate$$: Subscription;
  slot$: Observable<DataForSelect[]>;
  grade$: Observable<Grade[]>;
  grade$$: Subscription;

  constructor(
    private structureService: StructureService,
    public activeModal: NgbActiveModal,
    private calendarService: CalendarService,
    private defaultBranchService: DefaultBranchService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.grade$ = this.structureService.getAllGrades();
    this.defaultBranchService.defaultBranch$
      .subscribe(branch_id => {
        if (branch_id) {
          this.branch_id = branch_id;
        }
      });
    this.listenToCommencementDate();
    this.listenToGrade();
    this.transferInForm.patchValue({
      grade_id: this.data.student.student.grade.id,
      start_date: this.convertToDatePickerFormat(this.data.student.start_date)
    })
  }

  initializeForm() {
    this.transferInForm = new FormGroup({
      grade_id: new FormControl('', Validators.required),
      start_date: new FormControl('', Validators.required),
      to_class_id: new FormControl(0, Validators.required)
    })
  }

  listenToCommencementDate() {
    this.commencementDate$$ = this.transferInForm.get('start_date').valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        if (this.transferInForm.get('start_date').valid && this.transferInForm.get('grade_id').valid) {
          this.populateClassSlots();
        }
      })
  }

  listenToGrade() {
    this.grade$$ = this.transferInForm.get('grade_id').valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        if (this.transferInForm.get('start_date').valid && this.transferInForm.get('grade_id').valid) {
          this.populateClassSlots();
        }
      })
  }

  populateClassSlots() {
    this.slot$ =
      this.calendarService.getSuitableClasses(
        this.branch_id,
        this.convertDatePickerFormatForSubmit(this.transferInForm.get('start_date').value),
        this.transferInForm.get('grade_id').value
      )
      .pipe(
        map(slots => slots.map(slot => {
            return {
              id: slot.id,
              name: slot.label + ' (' +
                slot.number_enrolled + '/' +
                slot.max_class_size + ')',
            }
          })
        )
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
    return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
  }

  onSubmit() {
    if (!this.transferInForm.valid) {
      this.submitted = true;
      return;
    }
    this.transferInForm.get('start_date').setValue(this.convertDatePickerFormatForSubmit(this.transferInForm.get('start_date').value));
    this.activeModal.close(this.transferInForm.value)
  }
}
