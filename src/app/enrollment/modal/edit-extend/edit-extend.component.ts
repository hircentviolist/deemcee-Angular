import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EnrollmentService } from 'app/enrollment.service';
import * as moment from 'moment';

@Component({
	selector: 'app-edit-extend',
	templateUrl: './edit-extend.component.html',
	styleUrls: ['./edit-extend.component.css'],
})
export class EditExtendComponent implements OnInit {
	@Input() data: { enrolment_id: number; prev_lesson: any; lesson: any };

	form: FormGroup;

	submitted: boolean = false;

	datepickerMinDate: any;

	constructor(public activeModal: NgbActiveModal, private enrollmentService: EnrollmentService) {}

	ngOnInit(): void {
		this.form = new FormGroup({
			start_date: new FormControl('', Validators.required),
		});
		this.datepickerMinDate = this.convertToDatePickerFormat(
			moment(this.data.prev_lesson.date).add(1, 'day').format('YYYY-MM-DD')
		);
	}

	convertToDatePickerFormat(date: string) {
		if (date && date !== '') {
			const dateArray = date.split(' ')[0].split('-');
			return {
				year: +dateArray[0],
				month: +dateArray[1],
				day: +dateArray[2],
			};
		} else {
			return null;
		}
	}

	convertDatePickerFormatForSubmit(date: { year: number; month: number; day: number }) {
		if (date) {
			return (
				date.year.toString() +
				'-' +
				('0' + date.month.toString()).slice(-2) +
				'-' +
				('0' + date.day.toString()).slice(-2)
			);
		} else {
			return '';
		}
	}

	onSubmit() {
		if (this.form.invalid || this.submitted) {
			return;
		}

		this.submitted = true;

		const body = this.form.value;

		body.start_date = this.convertDatePickerFormatForSubmit(body.start_date);

		this.enrollmentService.extendUpdate(this.data.enrolment_id, body).subscribe(
			(res) => {
				this.activeModal.close(res);
			},
			(err) => {
				console.log(err);
				this.submitted = false;
				alert(err.error.message);
			}
		);
	}
}
