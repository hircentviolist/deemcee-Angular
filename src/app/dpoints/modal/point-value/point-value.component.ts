import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DPointService } from 'app/dpoints/dpoints.service';

@Component({
	selector: 'app-point-value',
	templateUrl: './point-value.component.html',
	styleUrls: ['./point-value.component.css']
})
export class PointValueComponent implements OnInit {
	@Input() data;
	
	title: string = 'Update Point Value';
	isLoading: boolean = false;
	form: FormGroup;
	key: string;

	constructor(
		public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		private dPointService: DPointService,
	) {
		this.form = this.fb.group({
			point_to_RM: new FormControl(''),
			complete_user_profile: new FormControl(''),
			daily_check_in: new FormControl(''),
			survey_completion: new FormControl(''),
			full_attendance: new FormControl(''),
			deshop_signup: new FormControl(''),
			'5_product_browsing': new FormControl(''),
			'10_product_browsing': new FormControl(''),
			product_review: new FormControl(''),
			refer: new FormControl(''),
		});
	}

	ngOnInit(): void {
		this.key = this.data.key;
		this.form.controls[this.key].setValue(this.data.points);

		if (this.key !== 'point_to_RM') {
			this.title = `Update '${this.titleCase(this.key.split('_').join(' '))}' points`;
		}
	}

	submit() {
		if (this.isLoading) {
			return;
		}

		if (this.form.invalid) {
			alert('Please fill all the fields')
			return;
		}

		this.isLoading = true;

		const body = {
			[this.key]: this.form.controls[this.key].value
		}

		if (!this.isValidBody(body)) {
			this.isLoading = false;
			alert('Invalid value')
			return;
		}

		this.dPointService.updateAccumulation(body).subscribe((res: any) => {
			this.activeModal.close({
				isSuccess: true,
				pointToRM: res.point_to_RM
			});
		}, err => {
			this.activeModal.close({
				isSuccess: false
			});
		})
	}

	isValidBody(body) {
		let isValid = true;

		Object.keys(body).forEach(key => {
			if (!+body[key]) {
				isValid = false;
			}
		});

		return isValid;
	}

	private titleCase(str: string): string {
		const splitStr = str.toLowerCase().split(' ');

		for (let i = 0; i < splitStr.length; i++) {
			splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
		}
		
		return splitStr.join(' '); 
	}
}
