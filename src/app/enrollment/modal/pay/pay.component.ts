import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EnrollmentService} from '../../../enrollment.service';
import { PromoCodeService } from 'app/promo-code/promo-code.service';
import { DefaultBranchService } from 'app/default-branch.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {

  @Input() data: any;
  paymentForm: FormGroup;
  payment_amount: number;
  amountToPay: string;

	branch_id: number;
  defaultBranch$$: Subscription;
  promoCodes: any;
  promoCodeErrorMessage: string = null;
  selectedPromoCode: any;
  discountAmount: number = 0;

  constructor(
      private defaultBranchService: DefaultBranchService,
		  private promoCodeService: PromoCodeService, 
      public activeModal: NgbActiveModal,
      private enrollmentService: EnrollmentService) { }

  ngOnInit(): void {
		this.defaultBranch$$ = this.defaultBranchService.defaultBranch$
			.subscribe(branch_id => {
				if (branch_id) {
					this.branch_id = branch_id;
					this.getPromoCodeList();
				}
      });
      
    this.initializeForm();
    this.amountToPay = this.data.amount;
    console.log('PayComponent, data: ', this.data);
    console.log('PayComponent, amount: ', (this.data.amount - this.data.pre_outstanding).toFixed(2));
    const amount = this.data.amount - this.data.pre_outstanding;

    this.paymentForm.patchValue({
      amount: amount < 0 ? '0.00' : amount.toFixed(2)
    })

    this.listenToSearch();
  }

  initializeForm() {
    this.paymentForm = new FormGroup({
      date: new FormControl(null),
      promo_code: new FormControl(''),
      amount: new FormControl('', Validators.required)
    })
  }

	getPromoCodeList() {
    this.promoCodeService.getPromoCodeListBranch(this.branch_id, true, 'enrolment').subscribe(res => {
			this.promoCodes = res;
			console.log(res)
		}, err => {
			alert(err.error.message)
			console.log(err)
		})
	}

  listenToSearch() {
    this.paymentForm.get('promo_code').valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(result => {
      if (!result) {
        this.selectedPromoCode = null;
        this.promoCodeErrorMessage = null;
      } else {
        this.selectedPromoCode = this.promoCodes.find(promo => promo.code.toLowerCase() === result.toLowerCase());
  
        if (this.selectedPromoCode) {
          if (
            this.selectedPromoCode.min_purchase_amount &&
            +this.data.amount < +this.selectedPromoCode.min_purchase_amount
          ) {
            this.promoCodeErrorMessage = 'Did not meet minimum purchase: RM' + (+this.selectedPromoCode.min_purchase_amount).toFixed(2);
          } else {
            this.promoCodeErrorMessage = null;
          }
        } else {
          this.promoCodeErrorMessage = 'Invalid promo code';
        }
      }
      this.updateAmount();
    })
  }

  updateAmount() {
    if (!this.promoCodeErrorMessage && this.selectedPromoCode) {
      this.discountAmount = +this.selectedPromoCode.amount;

      const amount = (+this.data.amount - this.discountAmount).toFixed(2);
      this.paymentForm.get('amount').setValue(amount);
      this.amountToPay = amount;
    } else {
      this.discountAmount = 0;
      this.paymentForm.get('amount').setValue(this.data.amount.toFixed(2))
      this.amountToPay = this.data.amount.toFixed(2);
    }
  }

  convertDatePickerFormatForSubmit(date: {year: number, month: number, day: number}) {
    // Converts {year: 2020, month: 10, day: 25} to 2020-10-25 for submit to server
    if (date) {
      console.log('convertDatePickerFormatForSubmit, year: ', date.year);
      console.log('convertDatePickerFormatForSubmit, month: ', date.month);
      console.log('convertDatePickerFormatForSubmit, day: ', date.day);
      return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
    } else {
      return null;
    }
  }

  payNow() {
    if (this.promoCodeErrorMessage) {
      return alert('The promo code is invalid, please remove it before submitting')
    }
    const body = this.paymentForm.value;
    body.date = body.date ? this.convertDatePickerFormatForSubmit(body.date) : null;
    console.log('payNow: ', body);
    this.enrollmentService.pay(this.data.id, this.paymentForm.value).subscribe(resp => {
      this.activeModal.close(resp);
    }, err => {
      console.log(err)
      alert(err.error.message)
    });
  }

	ngOnDestroy() {
		this.defaultBranch$$.unsubscribe();
	}
}
