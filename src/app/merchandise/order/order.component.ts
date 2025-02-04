import { Component, OnInit } from '@angular/core';
import { MerchandiseService } from '../merchandise.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StockRequestListItem } from 'app/model/stock-request-list-item';
import { StockRequestGet } from 'app/model/stock-request-get';
import { AuthService } from 'app/auth/auth.service';
import { take } from 'rxjs/operators';
import { StockRequestPatchStatus } from 'app/model/stock-request-patch-status';
import { Observable, Subscription } from 'rxjs';
import { DataForSelect } from 'app/model/data-for-select';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { DefaultBranchService } from 'app/default-branch.service';

@Component({
	selector: 'app-order',
	templateUrl: './order.component.html',
	styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
	state: {
		main: 'show' | 'add';
		rows: { state: 'show' | 'update' }[];
	};

	orders: StockRequestListItem;
	order: StockRequestGet;
	total = 0;

	orderForm: FormGroup;

	submitted = false;

	id: number;

	role: string;
	branch$: Observable<DataForSelect[]>;
	branch_id: number;
	branch$$: Subscription;

	page: number = 1;
	perPage: number = 20;
	pages = [];

	sortDate: string = 'desc';

	constructor(
		private authService: AuthService,
		private merchandiseService: MerchandiseService,
		private licenseeService: LicenseeService,
		private defaultBranch: DefaultBranchService
	) {
		authService.credential$.pipe(take(1)).subscribe((cred) => (this.role = cred.role));
	}

	ngOnInit(): void {
		this.branch$ = this.licenseeService.getBranchForSelect();
		this.branch$$ = this.defaultBranch.defaultBranch$.subscribe((branch_id) => {
			this.branch_id = branch_id;
			if (this.branch_id) {
				this.populateList();
			}
		});
	}

	initializeState() {
		this.state = {
			main: 'show',
			rows: [],
		};

		this.orders.data.forEach((el) => {
			this.state.rows.push({ state: 'show' });
		});
	}

	populateList() {
		this.perPage = this.role !== 'admin' && this.role !== 'superadmin' ? 9999 : this.perPage;
		this.merchandiseService.getAllOrders(this.branch_id, this.page, this.perPage, this.sortDate).subscribe(
			(data: any) => {
				this.orders = this.formatData(data);
				this.initializeState();
				this.initPagination(this.orders);
			},
			(error) => {
				console.error(error);
				alert(`Unable to fetch orders. ${JSON.stringify(error.error)}`);
			}
		);
	}

	formatData(response) {
		response.data = response.data.map((order: any, i) => {
			const { current_page, per_page } = response.meta;

			order.number = i + 1 + (current_page - 1) * per_page;

			return order;
		});
		return response;
	}

	initPagination(response) {
		this.page = +response.meta.current_page;
		this.pages = [];

		if (response.data.length) {
			for (let i = 0; i < response.meta.last_page; i++) {
				this.pages.push({
					number: i + 1,
					is_active: this.page === i + 1,
				});
			}
		}
	}

	paginationClicked(page) {
		const currentPage = this.pages.find((p) => p.is_active);
		let toPage = null;

		if (page === 'next') {
			toPage = +currentPage.number + 1;

			if (toPage > this.pages.length) {
				return;
			}

			this.pages.forEach((p) => (p.is_active = false));
			this.pages.find((p) => {
				p.is_active = +p.number === +toPage;
				return p.is_active;
			});
		} else if (page === 'prev') {
			toPage = +currentPage.number - 1;

			if (toPage <= 0) {
				return;
			}

			this.pages.forEach((p) => (p.is_active = false));
			this.pages.find((p) => {
				p.is_active = +p.number === +toPage;
				return p.is_active;
			});
		} else {
			this.pages.forEach((p) => (p.is_active = false));
			page.is_active = true;
			toPage = page.number;
		}

		if (toPage) {
			this.page = +toPage;
			this.populateList();
		}
	}

	onSubmit() {
		this.submitted = true;
		if (!this.orderForm.valid) {
			return;
		}

		// map order for submit
		const body: any = {};
		// body.branch_id = this.order.branch.id;
		// body.billing_address_id = this.order.billing.id;
		// body.status = this.orderForm.get('status').value;
		// body.shipping_address_id = this.order.shipping.id;
		// body.request_date = this.order.request_date;
		// body.customer_note = this.order.customer_notes;
		// body.staff_note = this.orderForm.get('staff_note').value || this.order.staff_notes;
		// body.items = this.order.items;

		if (this.isUpdate()) {
			// update

			this.merchandiseService.updateOrder(this.id, body).subscribe(
				() => {
					this.populateList();
					this.orderForm.reset();
				},
				(err) => {
					console.error(err);
					alert(`Unable to update Category. ${JSON.stringify(err.error)}`);
				}
			);
		} else {
			console.error('cannot add orders here');
		}
	}

	// updateRequestStatus(status: 'Approved' | 'Delivering' | 'Rejected' | 'Received') {
	//   const body: StockRequestPatchStatus = {
	//     status: status,
	//     customer_notes: this.order.customer_notes,
	//     staff_notes: this.order.customer_notes
	//   }
	//   this.merchandiseService.updateOrderStatus(this.id, body)
	//   .subscribe(
	//     () => {
	//       alert('Status Updated');
	//       this.populateList();
	//     }, err => console.error(JSON.stringify(err.error))
	//   )
	// }

	onDelete(id: number) {}

	onChangeMain(state: 'add' | 'show') {
		// reset all rows to show
		this.state.rows.map((r) => (r.state = 'show'));
		this.state.main = state;
		this.orderForm.reset();
	}

	onChangeRows(i: number, state: 'show' | 'update') {
		console.log(i, state);
		this.state.main = 'show';
		// reset all rows to show
		this.state.rows.map((r) => (r.state = 'show'));
		// set row to state
		this.state.rows[i].state = state;
		if (state === 'update') {
			this.orderForm.reset();
			this.submitted = false;
		}
	}

	isUpdate(): boolean {
		if (!this.state) {
			return false;
		}
		return this.state.rows.filter((s) => s.state === 'update').length > 0;
	}

	ngOnDestroy() {
		this.branch$$.unsubscribe();
	}
}
