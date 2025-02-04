import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DoGet } from 'app/model/do-get';
import { MerchandiseService } from '../merchandise.service';
import { Router } from '@angular/router';
import { AuthService } from 'app/auth/auth.service';
import { Credentials } from 'app/model/credentials';
import { take } from 'rxjs/operators';
import { DataForSelect } from 'app/model/data-for-select';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { DefaultBranchService } from 'app/default-branch.service';

@Component({
  selector: 'app-do',
  templateUrl: './do.component.html',
  styleUrls: ['./do.component.css']
})
export class DoComponent implements OnInit {

  do$: Observable<DoGet[]>
  cred: Credentials
  branch$: Observable<DataForSelect[]>;
  branch_id: number;
  branch$$: Subscription;

	page: number = 1;
	perPage: number = 20;
	pages = [];

  dos: any;

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
    ).subscribe(
      cred => this.cred = cred
    )
  }

  ngOnInit(): void {
    this.branch$ = this.licenseeService.getBranchForSelect();
    this.branch$$ =
    this.defaultBranch.defaultBranch$
    .subscribe(branch_id => {
      this.branch_id = branch_id;
      this.getAllDo()
    })
  }

  getAllDo() {
    this.perPage = this.cred.role !== 'admin' && this.cred.role !== 'superadmin' ? 9999 : this.perPage; 
    this.merchandiseService.getAllDo(this.branch_id, this.page, this.perPage)
      .subscribe(response => {
        this.dos = response;
        this.formatData(this.dos);
        this.initPagination(this.dos);
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
			this.getAllDo();
		}
	}

  onShip(id: number) {
    this.merchandiseService.updateDo(id, {status: 'Received'})
    .subscribe(() => {
      alert('Status Changed to Received');
      this.getAllDo()
      this.router.navigate([]);
    }, err => {
      console.error(err);
      alert(`Unable to update DO. ${JSON.stringify(err)}`)
    })
  }

  ngOnDestroy() {
    this.branch$$.unsubscribe();
  }
}
