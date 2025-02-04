import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EnrollmentService } from 'app/enrollment.service';

@Component({
	selector: 'app-edit-payment',
	templateUrl: './edit-payment.component.html',
	styleUrls: ['./edit-payment.component.css']
})
export class EditPaymentComponent implements OnInit {

	@Input() data: {id: number, date: string};
	paymentForm: FormGroup;
	isLoading: boolean = false;

	constructor(
		public activeModal: NgbActiveModal,
		private enrollmentService: EnrollmentService
	) { }

	ngOnInit(): void {
		this.initializeForm();
	}

	initializeForm() {
		this.paymentForm = new FormGroup({
		  	date: new FormControl(this.convertToDatePickerFormat(this.data.date)),
		});
	}
	
	submit() {
		if (this.isLoading) return;

		const body = this.paymentForm.value;
		body.date = this.convertDatePickerFormatForSubmit(body.date);

		if (!body.date) {
			return alert('Please provide a valid date');
		}

		this.isLoading = true;
		this.enrollmentService.editPayment(this.data.id, body).subscribe(resp => {
			this.isLoading = false;
		  	this.activeModal.close(resp);
		}, err => {
			console.log(err)
			this.isLoading = false;
			alert(err.error.message)
		});
	}

	convertDatePickerFormatForSubmit(date: {year: number, month: number, day: number}) {
		if (date) {
			return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
		} else {
			return null;
		}
	}

	convertToDatePickerFormat(date: string) {
		if (date && date !== '') {
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
}
