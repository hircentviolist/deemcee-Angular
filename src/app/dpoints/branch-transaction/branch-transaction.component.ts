import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/auth/auth.service';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { Credentials } from 'app/model/credentials';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { DPointService } from '../dpoints.service';
import { CreateTransactionComponent } from '../modal/create-transaction/create-transaction.component';
import { PurchaseDPointComponent } from '../modal/purchase-d-point/purchase-d-point.component';

@Component({
	selector: 'app-branch-transaction',
	templateUrl: './branch-transaction.component.html',
	styleUrls: ['./branch-transaction.component.css']
})
export class BranchTransactionComponent implements OnInit {
	isLoading: boolean = false;
	active: number = 1;
	cred: Credentials;
	
	monthYearList: Array<any> = [];
	months = moment.monthsShort();
	minDate = moment('2019-01-01');
	selectedMonthYearId: number = 1;
	
	branches: any;
	branchId: number;

	pointDetails: {point_balance: number, point_purchased: number, point_given: number};

	transactions: any;
	purchases: any;

	constructor(
		private licenseeService: LicenseeService,
		private dPointService: DPointService,
		private authService: AuthService,
		private modalService: NgbModal,
	) {
		this.authService.credential$.pipe(take(1)).subscribe(c => this.cred = c);
	}

	ngOnInit(): void {
		this.isLoading = true;
		this.monthYearList = this.generateMonthYearList();
		this.licenseeService.getBranchForSelect().subscribe((data: any) => {
			this.branches = data.filter(branch => branch.id !== 1);
			this.branchId = this.branches.length ? this.branches[0].id : null;

			if (this.branchId) {
				this.getDetails();
			}
		});
	}

	getDetails() {
		this.transactions = [];
		this.purchases = [];
		this.isLoading = true;
		const selectedDate = this.monthYearList.find(e => e.id === Number(this.selectedMonthYearId)).value;

		const body = {
			branch_id: this.branchId,
			...selectedDate,
		}
		
		this.dPointService.getBranchPoint(this.branchId).subscribe((res: any) => {
			this.pointDetails = res;
		})

		this.dPointService.getTransactions(body).subscribe((data: any) => {
			data.out.forEach(e => e.type = 'deduct');
			data.in.forEach(e => e.type = 'add');
			
			this.transactions = [...data.out, ...data.in];
			this.transactions.sort(function (left, right) {
				return moment.utc(right.date).diff(moment.utc(left.date))
			});
			
			this.isLoading = false;
		})

		this.dPointService.getPurchasedPoint(this.branchId).subscribe((data: any) => {
			this.purchases = data.map(d => {
				d.date = moment(d.created_at).format('YYYY-MM-DD');

				return d;
			});
		})
	}

	generateMonthYearList() {
		const pastThreeYears = moment().subtract(3, 'years');
		const startDate = pastThreeYears.isBefore(this.minDate, 'year') ? this.minDate : pastThreeYears;
		
		return this.getMonthYear(startDate).reverse().map((e, i) => {
			return {
				id: i + 1,
				...e
			}
		});	
	}

	getMonthYear(startDate, result = []) {
		const now = moment();

		if (!startDate.isSame(now, 'year') && startDate.isBefore(now, 'year')) {
			const monthYear = this.months.map((month, index) => {
				const tempDate = moment(`${startDate.format('YYYY')}-${('0' + (index + 1).toString()).slice(-2)}-01 00:00:00`);

				return {
					string: `${month} ${startDate.format('YYYY')}`,
					vsalue: {
						month: index + 1,
						year: startDate.format('YYYY')
					},
					value: {
						start_date: `${startDate.format('YYYY')}-${('0' + (index + 1).toString()).slice(-2)}-${tempDate.clone().startOf('month').format('DD')}`,
						end_date: `${startDate.format('YYYY')}-${('0' + (index + 1).toString()).slice(-2)}-${tempDate.clone().endOf('month').format('DD')}`
					}
				}
				
			});
			result.push(...monthYear)

			return this.getMonthYear(startDate.add(1, 'years'), result);
		} else if (startDate.isSame(now, 'year')) {
			let isFound = false;
			const monthYear = this.months.filter(month => {
				if (isFound) {
					return false;
				}

				if (month === now.format('MMM')) {
					isFound = true;
				}
				return true;
			}).map((month, index) => {
				const tempDate = moment(`${startDate.format('YYYY')}-${('0' + (index + 1).toString()).slice(-2)}-01 00:00:00`);

				return {
					string: `${month} ${startDate.format('YYYY')}`,
					value: {
						start_date: `${startDate.format('YYYY')}-${('0' + (index + 1).toString()).slice(-2)}-${tempDate.clone().startOf('month').format('DD')}`,
						end_date: `${startDate.format('YYYY')}-${('0' + (index + 1).toString()).slice(-2)}-${tempDate.clone().endOf('month').format('DD')}`
					}
				}
			});
			
			result.push(...monthYear)
		}

		return result;
	}

	createTransaction() {
		const modalRef = this.modalService.open(CreateTransactionComponent, {size: 'lg'});

		modalRef.componentInstance.data = {branch: this.branches.find(branch => +branch.id === +this.branchId)}
		modalRef.result.then(result => {
			if (result.isSuccess) {
				this.getDetails();
			} else {
				console.log(result.error)
				alert('Oops something wrong somewhere, unable to create transaction.');
			}
		}, err => {
			console.log('err: ', err)
		})
	}

	purchasePoints() {
		const modalRef = this.modalService.open(PurchaseDPointComponent);

		modalRef.componentInstance.data = {branch: this.branches.find(branch => +branch.id === +this.branchId)}
		modalRef.result.then(result => {
			if (result.isSuccess) {
				this.getDetails();
			} else {
				console.log(result.error)
				alert('Oops something wrong somewhere, unable to purchase point.');
			}
		}, err => {
			console.log('err: ', err)
		})
	}
}
