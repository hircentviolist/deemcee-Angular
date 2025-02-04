import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarService } from 'app/calendar/calendar.service';
import { DefaultBranchService } from 'app/default-branch.service';
import { EnrollmentService } from 'app/enrollment.service';
import { DataForSelect } from 'app/model/data-for-select';
import { EnrollmentListItem } from 'app/model/enrollment-list-item';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-change-class',
	templateUrl: './change-class.component.html',
	styleUrls: ['./change-class.component.css']
})
export class ChangeClassComponent implements OnInit {
	@Input() data: { student: EnrollmentListItem };

	defaultBranch$$: Subscription;
	startDate$$: Subscription;
	branch_id: number;

	submitted = false;
	form: FormGroup;
	classes$: Observable<DataForSelect[]>;

	constructor(
		public activeModal: NgbActiveModal,
		private defaultBranchService: DefaultBranchService,
		private calendarService: CalendarService,
		private enrollmentService: EnrollmentService,
	) { }

	ngOnInit(): void {
		this.defaultBranch$$ = this.defaultBranchService.defaultBranch$
			.subscribe(branch_id => {
				if (branch_id) {
					this.branch_id = branch_id;
				}
			});

		this.initializeForm();
		this.listenToStartDate();

		console.log(this.data.student)
	}

	listenToStartDate() {
		this.startDate$$ = this.form.get('start_date').valueChanges
			.pipe(
				debounceTime(300),
				distinctUntilChanged()
			)
			.subscribe(start_date => {
				if (this.form.get('start_date').valid) {
					this.classes$ = this.calendarService.getSuitableClasses(
						this.branch_id,
						this.convertDatePickerFormatForSubmit(start_date),
						this.data.student.grade_id)
							.pipe(map(slots => slots.map(slot => {
								return {
									id: slot.id,
									name: slot.label + ' (' +
										// slot.number_enrolled + '/' +
										slot.enrolments_count + '/' +
										6 + ')',
										// slot.max_class_size + ')',
								}
							}).filter(slot => slot.id !== this.data.student.enrolment.class_id)
						))
			}
		})
	}

	convertDatePickerFormatForSubmit(date: {year: number, month: number, day: number}) {
		// Converts {year: 2020, month: 10, day: 25} to 2020-10-25 for submit to server
		if (date) {
		  	return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
		} else {
		  	return '';
		}
	}

	initializeForm() {
		this.form = new FormGroup({
			start_date: new FormControl('', Validators.required),
			class_id: new FormControl(0, Validators.required),
		});
	}

	onSubmit() {
		if (this.form.invalid) {
			return;
		}

		const body = this.form.value;
		this.submitted = true;
		if (!body.class_id) {
			return;
		}

		body.start_date = this.convertDatePickerFormatForSubmit(body.start_date);

		this.enrollmentService.changeClass(this.data.student.enrolment.id, body, this.branch_id).subscribe(res => {
			this.activeModal.close(res);
		}, err => {
			console.log(err)
			alert(err.error.message)
		})
	}
}
