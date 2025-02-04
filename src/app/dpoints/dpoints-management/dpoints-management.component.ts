import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { DPointService } from '../dpoints.service';
import { CreateCampaignComponent } from '../modal/create-campaign/create-campaign.component';
import { CreateRedemptionComponent } from '../modal/create-redemption/create-redemption.component';

@Component({
	selector: 'app-dpoints-management',
	templateUrl: './dpoints-management.component.html',
	styleUrls: ['./dpoints-management.component.css']
})
export class DPointsManagementComponent implements OnInit {
	isLoading: boolean = false;

	accumulations: {no: number, key: string, subject: string, points: number, section: string} [];
	redemptions: {no: number, title: string, points_needed: number, value_in_rm: number, validity: number, validity_unit: string} [];
	campaigns: {no: number, id: number, title: string, points_given: number, bonus_given: number, expired_date: Date}[];

	pageIndex: number = 0;

	constructor(
		private dPointService: DPointService,
		private route: ActivatedRoute,
		private router: Router,
		private modalService: NgbModal,
	) {
		this.route.queryParams.subscribe(params => {
			if (params.index) {
				this.pageIndex = isNaN(params.index) ? 0 : Number(params.index);
			}
		})
	}

	ngOnInit(): void {
		this.goTo(this.pageIndex);
	}

	getAccumulations() {
		this.isLoading = true;

		this.dPointService.getAccumulations().subscribe((data: any) => {
			this.accumulations = Object.keys(data)
				.filter(key => key !== 'point_to_RM')
				.map((key, index) => {
					return {
						no: index + 1,
						key,
						subject: this.dPointService.titleCase(key.split('_').join(' ')),
						points: data[key],
						section: 'DeLIVE'
					}
				});

			this.isLoading = false;
		})
	}

	getRedemptions() {
		this.isLoading = true;

		this.dPointService.getRedemptions().subscribe((data: any) => {
			this.redemptions = data.map((d, i) => {
				return {
					no: i + 1,
					...d,
				}
			});
			this.isLoading = false;
		})
	}

	getCampaigns() {
		this.isLoading = true;

		this.dPointService.getCampaigns().subscribe((data: any) => {
			this.campaigns = data.map((d, i) => {
				return {
					no: i + 1,
					id: d.id,
					title: d.title,
					points_given: d.points,
					bonus_given: d.bonus_multiply,
					expired_date: moment(d.end_datetime).format('YYYY-MM-DD')
				}
			})
			
			this.isLoading = false;
		})
	}

	goTo(index: number) {
		this.pageIndex = index;

		this.router.navigate([], {
			queryParams: {
			  	index: this.pageIndex
			},
			queryParamsHandling: 'merge',
		});

		switch (this.pageIndex) {
			case 0:
				if (!this.accumulations) {
					this.getAccumulations();
				}
			break;

			case 1:
				if (!this.redemptions) {
					this.getRedemptions();
				}
			break;

			case 2:
				if (!this.campaigns) {
					this.getCampaigns();
				}
			break;
		}
	}

	createRedemption() {
		const modalRef = this.modalService.open(CreateRedemptionComponent);

		modalRef.result.then(result => {
			if (result.isSuccess) {
				this.getRedemptions();
			} else {
				console.log(result.error)
				alert('Oops something wrong somewhere, unable to create redemption.');
			}
		}, err => {
			console.log('err: ', err)
		})
	}

	editRedemption(voucher) {
		const modalRef = this.modalService.open(CreateRedemptionComponent);

		modalRef.componentInstance.data = { voucher };
		modalRef.result.then(result => {
			if (result.isSuccess) {
				this.getRedemptions();
			} else {
				console.log(result.error)
				alert('Oops something wrong somewhere, unable to update redemption.');
			}
		}, err => {
			console.log('err: ', err)
		})
	}

	createCampaign() {
		const modalRef = this.modalService.open(CreateCampaignComponent, {size: 'lg'});

		modalRef.result.then(result => {
			if (result.isSuccess) {
				this.getCampaigns();
			} else {
				console.log(result.error)
				alert('Oops something wrong somewhere, unable to create campaign.');
			}
		}, err => {
			console.log('err: ', err)
		})
	}

	editCampaign(id: number) {
		const modalRef = this.modalService.open(CreateCampaignComponent, {size: 'lg'});

		modalRef.componentInstance.data = {id}
		modalRef.result.then(result => {
			if (result.isSuccess) {
				this.getCampaigns();
			} else {
				console.log(result.error)
				alert('Oops something wrong somewhere, unable to create campaign.');
			}
		}, err => {
			console.log('err: ', err)
		});
	}
}
