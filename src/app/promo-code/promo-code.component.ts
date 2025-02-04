import { Component, OnInit } from '@angular/core';
import { TitleService } from 'app/shared/title.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PromoCodeService } from './promo-code.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-promo-code',
	templateUrl: './promo-code.component.html',
	styleUrls: ['./promo-code.component.css']
})
export class PromoCodeComponent implements OnInit {
	promoCodes$: Observable<any>;

	constructor(
		private titleService: TitleService,
		private promoCodeService: PromoCodeService
	) {
		this.titleService.postTitle('Promo Code');
	}

	ngOnInit(): void {
		this.getPromoCodeList();
	}

	getPromoCodeList(): void {
		this.promoCodes$ = this.promoCodeService.getPromoCodeListAdmin()
			.pipe(
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
			);
	}

	delete(promoCode): void {
		Swal.fire({
			icon: 'warning',
			title: `Delete '${promoCode.code}'`,
			text: `Are you sure? You won't be able to revert this.`,
			showCancelButton: true,
			confirmButtonText: 'Yes, delete it!',
		}).then((result) => {
			if (result.value) {
				this.promoCodeService.deletePromoCode(+promoCode.id).subscribe(res => {
					this.getPromoCodeList();
					Swal.fire(
						'Deleted!',
						`'${promoCode.code}' has been deleted.`,
						'success'
					);
				}, err => {
					Swal.fire(
						'Oops',
						err.error.message,
						'error'
					);
				})
			}
		})
	}
}
