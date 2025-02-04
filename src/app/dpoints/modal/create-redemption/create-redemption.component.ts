import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DPointService } from 'app/dpoints/dpoints.service';

@Component({
	selector: 'app-create-redemption',
	templateUrl: './create-redemption.component.html',
	styleUrls: ['./create-redemption.component.css']
})
export class CreateRedemptionComponent implements OnInit {
	@Input() data;
	
	mode: string = 'create';
	isLoading: boolean = false;
	form: FormGroup;

	validityUnits = [
		{value: 'months', label: 'Months'},
		{value: 'years', label: 'Years'}
	];

	constructor(
		public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		private dPointService: DPointService,
	) {
		this.form = this.fb.group({
			id: new FormControl(''),
			title: new FormControl('', Validators.required),
			points_needed: new FormControl('', Validators.required),
			value_in_rm: new FormControl('', Validators.required),
			validity: new FormControl('', Validators.required),
			validity_unit: new FormControl('months', Validators.required),
		});
	}

	ngOnInit(): void {
		if (this.data && this.data.voucher) {
			this.mode = 'update';
			this.form.patchValue(this.data.voucher);
		}
	}

	submit() {
		if (this.form.invalid) {
			return alert('Please fill all the fields');
		}
		this.isLoading = true;

		if (this.mode === 'create') {
			this.dPointService.createRedemptions(this.form.value).subscribe(res => {
				this.activeModal.close({
					isSuccess: true,
					response: res
				});
			}, err => {
				this.activeModal.close({
					isSuccess: false,
					error: err
				});
			})
		} else if (this.mode === 'update') {
			this.dPointService.updateRedemptions(this.form.value).subscribe(res => {
				this.activeModal.close({
					isSuccess: true,
					response: res
				});
			}, err => {
				this.activeModal.close({
					isSuccess: false,
					error: err
				});
			})
		}
	}

}
