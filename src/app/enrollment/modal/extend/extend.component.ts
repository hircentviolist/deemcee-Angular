import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {EnrollmentListItem} from '../../../model/enrollment-list-item';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarService } from 'app/calendar/calendar.service';
import { DefaultBranchService } from 'app/default-branch.service';
import { EnrollmentService } from 'app/enrollment.service';
import { DataForSelect } from 'app/model/data-for-select';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-extend',
  templateUrl: './extend.component.html',
  styleUrls: ['./extend.component.css']
})
export class ExtendComponent implements OnInit {

  @Input() data: {student: EnrollmentListItem};

	defaultBranch$$: Subscription;
	startDate$$: Subscription;
	branch_id: number;

	form: FormGroup;
	classes$: Observable<DataForSelect[]>;
  lastClassLesson: any;
  datepickerMinDate: any;
  submitted = false;

  constructor(
		public activeModal: NgbActiveModal,
		private defaultBranchService: DefaultBranchService,
		private calendarService: CalendarService,
  ) { }

  ngOnInit(): void {
    console.log(this.data.student.class_lesson)
		this.defaultBranch$$ = this.defaultBranchService.defaultBranch$
			.subscribe(branch_id => {
				if (branch_id) {
					this.branch_id = branch_id;
				}
			});

		this.initializeForm();
		this.listenToStartDate();
  }

	initializeForm() {
		this.form = new FormGroup({
			start_date: new FormControl('', Validators.required),
			class_id: new FormControl(0, Validators.required),
    });

		this.lastClassLesson = moment(this.data.student.class_lesson[this.data.student.class_lesson.length - 1].start_datetime).format('YYYY-MM-DD');
		this.datepickerMinDate = this.convertToDatePickerFormat(moment(this.lastClassLesson).add(1, 'day').format('YYYY-MM-DD'));
    // this.form.patchValue({
    //   start_date: this.convertToDatePickerFormat(lastClassLesson ? lastClassLesson.start_datetime : null),
    //   class_id: this.data.student.enrolment.class_id,
    // })
    // this.updateClassList(this.form.get('start_date').value);
	}

  convertToDatePickerFormat(date: string) {
    // Converts 2020-10-25 to {year: 2020, month: 10, day: 25} for datepicker use

    if (date && date !== '') {
      const dateArray = date.split(' ')[0].split('-');
      return {
        year: +dateArray[0],
        month: +dateArray[1],
        day: +dateArray[2],
      }
    } else {
      return null;
    }
  }

	listenToStartDate() {
		this.startDate$$ = this.form.get('start_date').valueChanges
			.pipe(
				debounceTime(300),
				distinctUntilChanged()
			)
			.subscribe(start_date => {
				if (this.form.get('start_date').valid) {
          this.form.patchValue({
            class_id: this.data.student.enrolment.class_id,
          });
          this.updateClassList(start_date);
			  }
		})
	}

  updateClassList(start_date) {
    this.classes$ = this.calendarService.getAdvanceExtendClasses(
      this.data.student.enrolment.id,
      this.convertDatePickerFormatForSubmit(start_date),
      this.data.student.grade_id)
        .pipe(map(slots => slots.map(slot => {
          return {
            id: slot.id,
            name: slot.label + ' (' +
              slot.number_enrolled + '/' +
              6 + ')',
              // slot.max_class_size + ')',
          }
        })
      ))
  }

	convertDatePickerFormatForSubmit(date: {year: number, month: number, day: number}) {
		// Converts {year: 2020, month: 10, day: 25} to 2020-10-25 for submit to server
		if (date) {
		  	return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
		} else {
		  	return '';
		}
	}

  extend() {
    if (this.form.invalid) {
      return;
    } else if (!this.form.value.class_id) {
			return;
    }

    this.submitted = true;
    const data = this.form.value;
    this.activeModal.close({
      ...data,
      start_date: this.convertDatePickerFormatForSubmit(data.start_date),
    })
  }
}
