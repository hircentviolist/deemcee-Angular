import { Component, OnInit, OnDestroy } from '@angular/core';
import { MerchandiseListItem } from 'app/model/merchandise-list-item';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MerchandiseService } from '../merchandise.service';
import { MerchandiseGet } from 'app/model/merchandise-get';
import { noop, Observable, Subscription } from 'rxjs';
import { DataForSelect } from 'app/model/data-for-select';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { InventoryListItem } from 'app/model/inventory-list-item';
import { ActivatedRoute } from '@angular/router';
import { Credentials } from 'app/model/credentials';
import { AuthService } from 'app/auth/auth.service';
import { take } from 'rxjs/operators';
import { DefaultBranchService } from 'app/default-branch.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {

  cred: Credentials;
  branch$: Observable<DataForSelect[]>;
  branch_id: number;
  product$: Observable<MerchandiseListItem[]>;
  branch$$: Subscription;
  products: any;

	page: number = 1;
	perPage: number = 20;
	pages = [];

  constructor(
    private merchandiseService: MerchandiseService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private defaultBranch: DefaultBranchService,
    private licenseeService: LicenseeService) {
      this.authService.credential$
      .pipe(
        take(1)
      ).subscribe(cred => this.cred = cred)
    }

  ngOnInit(): void {
    this.branch$ = this.licenseeService.getBranchForSelect();
    this.branch$$ =
    this.defaultBranch.defaultBranch$
    .subscribe(branch_id => {
      this.branch_id = branch_id;
      this.getProducts()
    })
  }

  onSelectBranch(e) {
    if (!e.target.value) {
      return;
    }
    this.branch_id = +e.target.value;
    this.getProducts();
  }

  getProducts() {
    this.merchandiseService.getAllProducts(this.branch_id, this.page, this.perPage).subscribe(res => {
      this.products = res;
      this.formatData(this.products);
      this.initPagination(this.products);
    });
  }

  formatData(response) {
    response.data = response.data.map((product: any, i) => {
      const { current_page, per_page } = response.meta;
      product._number = (i + 1) + ((current_page - 1 ) * per_page);
      return product;
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
			this.getProducts();
		}
	}

  ngOnDestroy() {
    this.branch$$.unsubscribe();
  }


}
