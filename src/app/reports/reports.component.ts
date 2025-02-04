import { Component, OnInit } from '@angular/core';
import { TitleService } from 'app/shared/title.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Credentials } from 'app/model/credentials';
import { AuthService } from 'app/auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
    moduleId: module.id,
	selector: 'app-reports',
	templateUrl: './reports.component.html',
	styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
	cred: Credentials;
	active = 1;
	isOverall: boolean = true;
	queryParams: any;
	
	constructor(
		private titleService: TitleService,
		private location: Location,
		private router: Router,
		private route: ActivatedRoute,
		private authService: AuthService,
	) {
		this.titleService.postTitle('Reports');
		this.authService.credential$.pipe(take(1)).subscribe(c => this.cred = c);
		this.route.queryParams.subscribe(params => {
			this.queryParams = params;
			if (params.active) {
				this.active = isNaN(params.active) ? 1 : Number(params.active);
				this.onChangeTab();
			}
		})
	}

	ngOnInit(): void {
	}

	onChangeTab() {
		this.router.navigate([], {
			queryParams: {
			  	active: this.active
			},
			queryParamsHandling: 'merge',
		});
	}

	goBack() {
		this.router.navigate(['hq/reports'], {
			queryParams: this.queryParams,
			queryParamsHandling: 'merge',
		});
	}
}
