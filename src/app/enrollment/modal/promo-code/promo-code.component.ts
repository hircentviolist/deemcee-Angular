import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultBranchService } from 'app/default-branch.service';
import { DataForSelect } from 'app/model/data-for-select';
import { PromoCodeService } from 'app/promo-code/promo-code.service';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-promo-code',
	templateUrl: './promo-code.component.html',
	styleUrls: ['./promo-code.component.css']
})
export class PromoCodeComponent implements OnInit {
	branch_id: number;
	branch$: Observable<DataForSelect[]>;
	defaultBranch$$: Subscription;
	promoCodes: any = [];
	isLoading: boolean = true;

	constructor(
		public activeModal: NgbActiveModal,
		private promoCodeService: PromoCodeService,
		private defaultBranchService: DefaultBranchService,
	) { }

	ngOnInit(): void {
		this.defaultBranch$$ = this.defaultBranchService.defaultBranch$
			.subscribe(branch_id => {
				if (branch_id) {
					this.branch_id = branch_id;
					this.getPromoCodeList();
				}
			});
	}

	getPromoCodeList() {
		this.promoCodeService.getPromoCodeListBranch(this.branch_id).pipe(
			map((promoCodes: any) => {
				return promoCodes.map(promoCode => {
					const expiredDate = promoCode.expired_at ? moment(promoCode.expired_at) : null;

					promoCode.expired_at = expiredDate ? expiredDate.format('MMM DD YYYY') : '-';
					promoCode.min_purchase_amount = +promoCode.min_purchase_amount ? `RM ${(+promoCode.min_purchase_amount).toFixed(2)}` : '-';
					promoCode.amount = `RM ${(+promoCode.amount).toFixed(2)}`;
					promoCode.status = !expiredDate ? 'Active' : expiredDate && moment().isBefore(expiredDate) ? 'Active' : 'Expired';
					promoCode.left = +promoCode.quantity - +promoCode.used;

					return promoCode;
				})
			})
		).subscribe(res => {
			this.isLoading = false;
			this.promoCodes = res;
			console.log(res)
		}, err => {
			this.isLoading = false;
			alert(err.error.message)
			console.log(err)
		})
	}

	ngOnDestroy() {
		this.defaultBranch$$.unsubscribe();
	}
}
