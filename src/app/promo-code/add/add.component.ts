import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { TitleService } from 'app/shared/title.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { PromoCodeService } from '../promo-code.service';
import { Location } from '@angular/common';

interface Body {
	branch_ids: number[],
	code: string;
	amount: number,
	min_purchase_amount: number,
	quantity: number,
	type: string,
	expired_at: string// '2020-03-24'
}

@Component({
	selector: 'app-add',
	templateUrl: './add.component.html',
	styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
	isLoading: boolean = false;
	promoCodeForm: FormGroup;
	promoCodeId: number;
	branchDropdownSettings: IDropdownSettings = {
		singleSelection: false,
		textField: 'name',
		selectAllText: 'Select All',
		unSelectAllText: 'UnSelect All',
		itemsShowLimit: 3,
		allowSearchFilter: true,
		enableCheckAll: true,
	}
	branchOptions: {id: number, name: string}[] = [];
	selectedBranchOption: {id: number, name: string}[] = [];
	invalidMultiSelect: boolean = false;

	constructor(
		private titleService: TitleService,
		private promoCodeService: PromoCodeService,
		private location: Location,
		private route: ActivatedRoute,
		private licenseeService: LicenseeService,
	) {
		this.route.params.subscribe((params: {id: number}) => {
			if (params && params.id) {
				this.promoCodeId = params.id;
				this.getPromoCode();
			}
		});
		this.titleService.postTitle('Promo Code');
	}
	
	ngOnInit(): void {
		this.initForm();
		this.getBranch();
	}

	getBranch() {
		this.licenseeService.getBranchForSelect().subscribe(branches => {
			this.branchOptions = branches.filter(b => b.id !== 1);
		});
	}

	getPromoCode() {
		this.promoCodeService.getOnePromoCodeAdmin(this.promoCodeId).subscribe((res: any) => {
			res.expired_date = res.expired_at ? this.convertDateFormat(res.expired_at) : null;

			this.selectedBranchOption = res.branches;
			this.promoCodeForm.patchValue(res);
		}, err => {
			console.log(err)
			alert(err.error.message);
			this.location.back();
		})
	}

	initForm(): void {
		this.promoCodeForm = new FormGroup({
			code: new FormControl('', Validators.required),
			amount: new FormControl('', Validators.required),
			min_purchase_amount: new FormControl(''),
			quantity: new FormControl('', Validators.required),
			expired_date: new FormControl(null),
			type: new FormControl(''),
		})
	}

	submit(): void {
		this.dirtyForm();

		if (this.invalidMultiSelect || this.isLoading || this.promoCodeForm.invalid) {
			this.isLoading = false;
			return;
		}
		this.isLoading = true;
		const body = this.getBody();
		
		if (this.isUpdate()) {
			this.promoCodeService.updatePromoCode(body, this.promoCodeId).subscribe(res => {
				this.isLoading = false;
				this.location.back();
			}, err => {
				this.isLoading = false;
				console.log(err)
				alert(err.error.message);
			})
		} else {
			this.promoCodeService.createPromoCode(body).subscribe(res => {
				this.isLoading = false;
				this.location.back();
			}, err => {
				this.isLoading = false;
				console.log(err)
				alert(err.error.message);
			})
		}
	}

	onMultiSelectChange(): void {
		setTimeout(() => {
			this.invalidMultiSelect = this.selectedBranchOption.length ? false : true;
		}, 1)
	}

	getBody(): Body {
		const {code, amount, min_purchase_amount, quantity, type} = this.promoCodeForm.value;
		
		return {
			branch_ids: this.selectedBranchOption.map(b => b.id),
			code,
			amount,
			min_purchase_amount: min_purchase_amount || 0,
			quantity,
			type,
			expired_at: this.promoCodeForm.value.expired_date ? 
				this.convertDatePickerFormat(this.promoCodeForm.value.expired_date) :
				null
		}
	}

	convertDatePickerFormat(date: NgbDateStruct): string {
		return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
	}

	convertDateFormat(dateTime: string): NgbDateStruct {
		const date = dateTime.split(' ')[0].split('-');

		return {
			year: +date[0],
			month: +date[1],
			day: +date[2]
		}
	}

	dirtyForm(): void {
		this.onMultiSelectChange();
		Object.keys(this.promoCodeForm.controls).forEach(key => {
			this.promoCodeForm.controls[key].markAsTouched();
		})
	}

	isUpdate(): boolean {
		return !!this.promoCodeId;
	}
}
