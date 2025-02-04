import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultBranchService } from 'app/default-branch.service';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { DataForSelect } from 'app/model/data-for-select';
import { Observable, Subscription } from 'rxjs';
import { ReportsService } from '../reports.service';
import { Credentials } from 'app/model/credentials';

import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
	selector: 'app-licensee-report',
	templateUrl: './licensee-report.component.html',
	styleUrls: ['./licensee-report.component.css']
})

export class LicenseeReportComponent implements OnInit {
	@Input() cred: Credentials;
	@Input() isOverall: boolean;
	@Output() isOverallChange: EventEmitter<any> = new EventEmitter(true);

	isLoading = false;
	years: {name: string, value: number} []= [];
	months: {name: string, value: number} [] = [];
	minDate = moment('2019-01-01');
	// selectedMonthYearId: number = 1;
	// monthYearList: Array<any> = [];

	filters: {branch_id: number, year: number, month: number} = {
		branch_id: 1,
		year: +moment().format('YYYY'),
		month: +moment().format('MM'),
	};

	branch$: Observable<DataForSelect[]>;
	defaultBranch$$: Subscription;
	branch_id: number;

	students: Array<any>;
	branches: Array<any>;
	branch: any;

	leftItems = [
		{ key: 'new_enrolment', name: 'New Enrolment', value: 0 },
		{ key: 'freezed', name: 'Freezed', value: 0 },
		{ key: 'dropped_out', name: 'Dropped Out', value: 0 },
		{ key: 'advanced', name: 'Advanced', value: 0 },
		{ key: 'transfer_in', name: 'Transfer In', value: 0 },
		{ key: 'extend', name: 'Extended', value: 0 },
		{ key: 'transfer_out', name: 'Transfer Out', value: 0 },
		{ key: 'graduated', name: 'Graduated', value: 0 },
	];
	rightItems = [
		{ key: 'total_active_students', name: 'Total Active Students', value: 0 },
		{ key: 'total_fees_collected', name: 'Total Fees (RM)', value: 0 },
		{ key: 'total_royalty_fees', name: 'Royalty (RM)', value: 0 },
	];

	invoice: any;
	queryParams: any;

    constructor(
		private licenseeService: LicenseeService,
		private defaultBranchService: DefaultBranchService,
		private reportsService: ReportsService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.getQueryParams();
		this.generateYearList();
		this.generateMonthList();
	}

    ngOnInit(): void {
		// this.selectedMonthYearId = this.queryParams?.my_id ? this.queryParams.my_id : this.selectedMonthYearId;

		this.isLoading = true;
		// this.monthYearList = this.generateMonthYearList();

		this.branch$ = this.branch$ = this.licenseeService.getBranchForSelect();
		this.defaultBranch$$ =
		this.defaultBranchService.defaultBranch$
			.subscribe(branch_id => {
				if (branch_id) {
					this.branch_id = branch_id;

					if (this.cred.role === 'superadmin' || this.cred.role === 'admin') {
						this.route.params.subscribe(params => {
							if (params.id) {
								this.branch_id = params.id;
								this.toggleIsOverallView(false);
							} else {
								this.toggleIsOverallView(true);
							}
						})
					}

					this.populateReports();
				}
			})
    }

	generateYearList() {
		const now = moment();

		while (!this.minDate.isSame(now, 'year') && this.minDate.isBefore(now, 'year')) {
			this.years.push({
				name: this.minDate.format('YYYY'),
				value: +this.minDate.format('YYYY')
			});

			this.minDate.add(1, 'year');
		}

		if (this.minDate.isSame(now, 'year')) {
			this.years.push({
				name: this.minDate.format('YYYY'),
				value: +this.minDate.format('YYYY')
			});
      // Add next year
      this.minDate.add(1, 'year');
      this.years.push({
        name: this.minDate.format('YYYY'),
        value: +this.minDate.format('YYYY')
      });
      // Invert the list
			this.years.reverse();
		}
	}

	generateMonthList() {
	  this.months = moment.months().map((month, i) => {
		return {
		  name: month,
		  value: i + 1
		}
	  });
	  this.months.reverse();
	}

	// generateMonthYearList() {
	// 	const pastThreeYears = moment().subtract(3, 'years');
	// 	const startDate = pastThreeYears.isBefore(this.minDate, 'year') ? this.minDate : pastThreeYears;

	// 	return this.getMonthYear(startDate).reverse().map((e, i) => {
	// 		return {
	// 			id: i + 1,
	// 			...e
	// 		}
	// 	});
	// }

	// getMonthYear(startDate, result = []) {
	// 	const now = moment();

	// 	if (!startDate.isSame(now, 'year') && startDate.isBefore(now, 'year')) {
	// 		const monthYear = this.months.map((month, index) => {
	// 			return {
	// 				string: `${month} ${startDate.format('YYYY')}`,
	// 				value: {
	// 					month: index + 1,
	// 					year: startDate.format('YYYY')
	// 				}
	// 			}
	// 		});
	// 		result.push(...monthYear)

	// 		return this.getMonthYear(startDate.add(1, 'years'), result);
	// 	} else if (startDate.isSame(now, 'year')) {
	// 		let isFound = false;
	// 		const monthYear = this.months.filter(month => {
	// 			if (isFound) {
	// 				return false;
	// 			}

	// 			if (month === now.format('MMM')) {
	// 				isFound = true;
	// 			}
	// 			return true;
	// 		}).map((month, index) => {
	// 			return {
	// 				string: `${month} ${startDate.format('YYYY')}`,
	// 				value: {
	// 					month: index + 1,
	// 					year: startDate.format('YYYY')
	// 				}
	// 			}
	// 		});

	// 		result.push(...monthYear)
	// 	}

	// 	return result;
	// }

	populateReports() {
		this.invoice = null;
		// const selected = this.monthYearList.find(e => e.id === Number(this.selectedMonthYearId)).value;

		if (this.cred.role === 'superadmin' || this.cred.role === 'admin') {
			if (!this.isOverall) {
				this.filters.branch_id = this.branch_id;
				// selected.branch_id = this.branch_id;

				this.reportsService.getOneLicenseeReport(this.filters).subscribe(reports => {
					this.patchReport(reports);
				}, err => console.error(`Failed to load reports. ${JSON.stringify(err.error)}`))
			} else {
				const {year, month} = this.filters;
				this.reportsService.getLicenseeReport({year, month}).subscribe(reports => {
					this.patchReport(reports);
				}, err => console.error(`Failed to load reports. ${JSON.stringify(err.error)}`));
			}
		} else {
			this.filters.branch_id = this.branch_id;
			// selected.branch_id = this.branch_id;

			this.reportsService.getOneLicenseeReport(this.filters).subscribe(reports => {
				this.patchReport(reports);
			}, err => console.error(`Failed to load reports. ${JSON.stringify(err.error)}`))
		}

	}

	patchReport(reports) {
		Object.keys(reports).forEach(key => {
			this.leftItems.forEach(e => {
				if (e.key === key) {
					e.value = reports[key];
				}
			})

			this.rightItems.forEach(e => {
				if (e.key === key) {
					e.value = reports[key];

					if (key === 'total_royalty_fees') {
						const isAdmin = this.cred.role === 'superadmin' || this.cred.role === 'admin';
						e.name = isAdmin && this.isOverall ? e.name : `Royalty (${reports.branch.grade.percentage}%) (RM)`;
					}
				}
			})

			switch (key) {
				case 'branches': this.branches = reports[key];
				break;

				case 'branch': this.branch = reports[key];
				break;

				case 'students': this.students = reports[key];
				break;

				case 'invoice': this.invoice = reports[key];
				break
			}
		});

		if (this.students) {
			this.students.forEach(student => {
				// find last payment date || end_date
				student.date = student.last_payment_datetime ?
					moment(student.last_payment_datetime).format('YYYY-MM-DD') :
					student.end_date ?
					moment(student.end_date).format('YYYY-MM-DD') :
					'-';

				if (student.payments.length) {
					student.payment = student.payments[student.payments.length - 1];
				}

				// calculate total student fees collected
				// student.fees = student.payments.reduce((acc, payment) => {
				// 	if (payment.status === 'paid') {
				// 		return acc + payment.total;
				// 	}
				// 	return acc + 0;
				// }, 0);

				student.fees = student.main_report.payment ? student.main_report.payment.amount_to_pay : 0;
				// get report action [new enrolment / advance / extended]
				student.action = student.main_report.action.split('_').join(' ').toLowerCase();
			});
		}

		this.isLoading = false;
	}

	generateInvoice() {
		Swal.fire({
			icon: 'question',
			title: 'Generate Invoice',
			text: "Are you sure you want to generate this invoice?",
			showCloseButton: true,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: 'white',
			cancelButtonText: '<span style="color:grey">Cancel<span>',
			confirmButtonText: 'Yes',
		}).then(result => {
			if (result.value) {
				// const selected = this.monthYearList.find(e => e.id === Number(this.selectedMonthYearId)).value;
				// selected.branch_id = this.branch_id;

				this.filters.branch_id = this.branch_id;
				this.reportsService.generateInvoice(this.filters).subscribe(invoice => {
					this.viewInvoice(invoice);
					this.populateReports();
				}, err => console.error(`Failed to load reports. ${JSON.stringify(err.error)}`));
			}

		Swal.showLoading()
		})
	}

	// onYearChange() {
	// 	this.addQueryParams({
	// 		my_id: this.selectedMonthYearId, // month year id
	// 	})
	// 	setTimeout(() => {
	// 		this.populateReports();
	// 	})
	// }

	onFilterChange() {
		this.addQueryParams({
			y: this.filters.year, // year
			m: this.filters.month
		})
		setTimeout(() => {
			this.populateReports();
		})
	}

	getQueryParams() {
		this.route.queryParams.subscribe(params => {
			this.queryParams = params;
			if (params.y) {
				this.filters.year = params.y;
			}

			if (params.m) {
				this.filters.month = params.m;
			}
		});
	}

	addQueryParams(params: {y: any, m: any}) {
        this.router.navigate([], {
			queryParams: params,
			queryParamsHandling: 'merge',
		});
	}

	viewInvoice(invoice) {
		window.open(invoice.file_path, '_blank');
	}

	toggleIsOverallView(status) {
		this.isOverall = status;
		this.isOverallChange.emit(this.isOverall);
	}

	ngOnDestroy(): void {
		this.defaultBranch$$.unsubscribe();
	}
}
