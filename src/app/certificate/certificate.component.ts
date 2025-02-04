import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleService } from 'app/shared/title.service';

@Component({
	selector: 'app-certificate',
	templateUrl: './certificate.component.html',
	styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
	tabNo: number = 1;

	constructor(
		private titleService: TitleService,
		private router: Router,
		private route: ActivatedRoute,
	) {
		this.titleService.postTitle('Certificate');
		this.route.queryParams.subscribe(params => {
			this.tabNo = 1;
			if (params.active) {
				this.tabNo = isNaN(params.active) ? 1 : Number(params.active);
			}
			this.onChangeTab();
		})
	}

	ngOnInit(): void {
	}

	onChangeTab() {
		this.router.navigate([], {
			queryParams: {
			  	active: this.tabNo
			},
			queryParamsHandling: 'merge',
		});
	}
}
