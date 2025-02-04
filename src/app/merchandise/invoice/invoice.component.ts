import { Component, OnInit } from '@angular/core';
import { MerchandiseService } from '../merchandise.service';
import { Observable, Subscription } from 'rxjs';
import { InvoiceGet } from 'app/model/invoice-get';
import { Router } from '@angular/router';
import { AuthService } from 'app/auth/auth.service';
import { Credentials } from 'app/model/credentials';
import { take } from 'rxjs/operators';
import { DataForSelect } from 'app/model/data-for-select';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { DefaultBranchService } from 'app/default-branch.service';
import * as moment from 'moment';

const FILTER_DEFAULT_STATE = {
  sort_date: 'desc',
  year: 0,
  month: 0,
}
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  invoice$: Observable<InvoiceGet[]>
  cred: Credentials
  branch$: Observable<DataForSelect[]>;
  branch_id: number;
  branch$$: Subscription;
  invoices: any;

	page: number = 1;
	perPage: number = 20;
	pages = [];

  filters: {sort_date: string, year: number, month: number} = {...FILTER_DEFAULT_STATE};

	minDate = moment('2019-01-01');
  yearList: {name: string, value: number} [] = [];
  monthList: {name: string, value: number} [] = [];

  constructor(
    private merchandiseService: MerchandiseService,
    private router: Router,
    private licenseeService: LicenseeService,
    private defaultBranch: DefaultBranchService,
    private authService: AuthService
  ) {
    authService.credential$
    .pipe(
      take(1)
    )
    .subscribe(
      cred => this.cred = cred
    )
  }

  ngOnInit(): void {
    this.branch$ = this.licenseeService.getBranchForSelect();
    this.branch$$ =
    this.defaultBranch.defaultBranch$
    .subscribe(branch_id => {
      this.branch_id = branch_id;
      this.getAllInvoices()
    })
    this.generateYearList();
    this.generateMonthList();
  }

	generateYearList() {
		const now = moment();
    
    while (!this.minDate.isSame(now, 'year') && this.minDate.isBefore(now, 'year')) {
      this.yearList.push({
        name: this.minDate.format('YYYY'),
        value: +this.minDate.format('YYYY')
      });

      this.minDate.add(1, 'year');
    }

    if (this.minDate.isSame(now, 'year')) {
      this.yearList.push({
        name: this.minDate.format('YYYY'),
        value: +this.minDate.format('YYYY')
      });
      this.yearList.reverse();
    }
	}
  
  generateMonthList() {
    this.monthList = moment.monthsShort().map((month, i) => {
      return {
        name: month,
        value: i + 1
      }
    });
    this.monthList.reverse();
  }

  onFilterChange() {
    this.getAllInvoices();
  }

  resetFilter() {
    this.filters = {...FILTER_DEFAULT_STATE};
    console.log('this.filters',this.filters);
    this.getAllInvoices();
  }

  getAllInvoices() {
    this.perPage = this.cred.role !== 'admin' && this.cred.role !== 'superadmin' ? 9999 : this.perPage; 
    this.merchandiseService.getAllInvoice(this.branch_id, this.page, this.perPage, this.filters)
      .subscribe(response => {
        this.invoices = response;
        this.formatData(this.invoices);
        this.initPagination(this.invoices);
      });
  }

  formatData(response) {
    response.data = response.data.map((invoice: any, i) => {
      const { current_page, per_page } = response.meta;
      invoice._number = (i + 1) + ((current_page - 1 ) * per_page);
      return invoice;
    })
    return response;
  }

	initPagination(response) {
		this.page = +response.meta.current_page;
		this.pages = [];

		if (response.data.length) {
			for (let i = 0; i < response.meta.last_page; i++) {
				this.pages.push({
					number: i + 1,
					is_active: this.page === (i + 1)
				});
			}
		}
	}

	paginationClicked(page) {
		const currentPage = this.pages.find(p => p.is_active);
		let toPage = null;

		if (page === 'next') {
			toPage = +currentPage.number + 1;

			if (toPage > this.pages.length) {
				return;
			}

			this.pages.forEach(p => p.is_active = false);
			this.pages.find(p => {
				p.is_active = +p.number === +toPage
				return p.is_active;
			})
		} else if (page === 'prev') {
			toPage = +currentPage.number - 1;

			if (toPage <= 0) {
				return;
			}

			this.pages.forEach(p => p.is_active = false);
			this.pages.find(p => {
				p.is_active = +p.number === +toPage
				return p.is_active;
			})
		} else {
			this.pages.forEach(p => p.is_active = false);
			page.is_active = true;
			toPage = page.number;
		}

		if (toPage) {
			this.page = +toPage;
			this.getAllInvoices();
		}
	}

  onPay(id: number) {
    this.merchandiseService.updateInvoice(id, {status: 'Paid'})
    .subscribe(() => {
      alert('Status Changed to Paid');
      this.getAllInvoices()
      this.router.navigate([]);
    }, err => {
      console.error(err);
      alert(`Unable to update status. ${JSON.stringify(err)}`)
    })
  }

  ngOnDestroy() {
    this.branch$$.unsubscribe();
  }
}
