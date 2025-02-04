import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DPointService } from 'app/dpoints/dpoints.service';

@Component({
	selector: 'app-purchase-d-point',
	templateUrl: './purchase-d-point.component.html',
	styleUrls: ['./purchase-d-point.component.css']
})
export class PurchaseDPointComponent implements OnInit {
	@Input() data;
	form: FormGroup;
	branch: {id: number, name: string};
	pointList: any;
	isLoading: boolean = true;

	constructor(
		public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		private dPointService: DPointService,
	) {
		this.form = this.fb.group({
			branch_id: new FormControl(''),
			dpoint_price_id: new FormControl('0'),
		});
	}

	ngOnInit(): void {
		this.branch = this.data.branch;
		this.dPointService.getPointList().subscribe((data: any) => {
			this.pointList = data;
			this.isLoading = false;
		})
	}

	submit() {
		if (this.isLoading) {
			return;
		}
		
		const body = this.form.value;
		body.branch_id = this.branch.id;

		if (body.dpoint_price_id === '0') {
			return alert('Please choose point');
		}

		this.isLoading = true;

		this.dPointService.purchasePoint(body).subscribe(res => {
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
