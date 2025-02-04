import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
	selector: 'app-custom-time-range',
	templateUrl: './custom-time-range.component.html',
	styleUrls: ['./custom-time-range.component.css']
})
export class CustomTimeRangeComponent implements OnInit {
	customTimeRangeForm: FormGroup;
	now = moment();
	submitted = false;

	startMinDate: any = {
		year: +this.now.clone().subtract('3', 'years').format('YYYY'),
		month: +this.now.clone().subtract('3', 'years').format('MM'),
		day: +this.now.clone().subtract('3', 'years').format('DD'),
	};

	startMaxDate: any = {
		year: +this.now.clone().subtract('1', 'months').format('YYYY'),
		month: +this.now.clone().subtract('1', 'months').format('MM'),
		day: +this.now.clone().subtract('1', 'months').format('DD'),
	};

	endMinDate: any;
	endMaxDate: any;

	constructor(
		public activeModal: NgbActiveModal,
	) {
		this.customTimeRangeForm = new FormGroup({
			start_date: new FormControl('', Validators.required),
			end_date: new FormControl('', Validators.required),
		})
	}

	ngOnInit(): void {
	}

	onDateChange(input): void {
		if (input === 'from') {
			const startDate = this.customTimeRangeForm.get('start_date').value;
			const endMinDate = moment(this.convertDatePickerFormat(startDate)).add(1, 'months');

			this.endMinDate = {
				year: +endMinDate.format('YYYY'),
				month: +endMinDate.format('MM'),
				day: +endMinDate.format('DD')
			}

			const now = moment();
			const endMaxDate = moment(this.convertDatePickerFormat(startDate)).add(1, 'years');

			if (now < endMaxDate) {
				this.endMaxDate = {
					year: +now.format('YYYY'),
					month: +now.format('MM'),
					day: +now.format('DD')
				}
			} else {
				this.endMaxDate = {
					year: +endMaxDate.format('YYYY'),
					month: +endMaxDate.format('MM'),
					day: +endMaxDate.format('DD')
				}
			}

		}
	}

	apply() {
		const form = this.customTimeRangeForm.value;
		this.submitted = true;
		if (!form.start_date || !form.end_date) {
			return;
		}

		this.activeModal.close({
			start_date: moment(this.convertDatePickerFormat(form.start_date)),
			end_date: moment(this.convertDatePickerFormat(form.end_date))
		});
	}


	convertDatePickerFormat(date: {year: number, month: number, day: number}) {
		// Converts {year: 2020, month: 10, day: 25} to 2020-10-25 00:00:00 for submit to server
		const time = '00:00:00';
		return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2) + ' ' + time;
	}
}
