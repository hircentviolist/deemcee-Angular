import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DPointService } from 'app/dpoints/dpoints.service';
import { BaseOptionRefiners } from '@fullcalendar/angular';

@Component({
	selector: 'app-show-parent',
	templateUrl: './show-parent.component.html',
	styleUrls: ['./show-parent.component.css']
})
export class ShowParentComponent implements OnInit {
	isLoading: boolean = false;
	id: number;
	parent: {
		id: number,
		name: string,
		email: string,
		balance: number
	};

	trxHistory: any;

	constructor(
		private route: ActivatedRoute,
		private location: Location,
		private dPointService: DPointService,
	) {
		this.route.params.subscribe(params => {
			this.id = params.parent_id;
		})
	}

	ngOnInit(): void {
		this.getDetails();
	}

	getDetails() {
		this.isLoading = true;
		this.dPointService.getPointBalance(this.id).subscribe((data: any) => {
			this.parent = {
				id: data.user.id,
				name: data.user.full_name,
				email: data.user.email,
				balance: data ? data.balance : 0
			}

			this.dPointService.getParentTransactionHistory(data.user.id).subscribe((res: any) => {
				this.trxHistory = res.data;
				this.isLoading = false;
			})
		})

	}

	goBack() {
		this.location.back();
	}

}
