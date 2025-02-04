import { Component, OnInit } from '@angular/core';
import { TitleService } from 'app/shared/title.service';
import { AuthService } from 'app/auth/auth.service';
import { take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-merchandise',
  templateUrl: './merchandise.component.html',
  styleUrls: ['./merchandise.component.css']
})
export class MerchandiseComponent implements OnInit {

  active: number = 1;
  role: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private titleService: TitleService) {
    titleService.postTitle('Merchandise')
    authService.credential$
    .pipe(
      take(1)
    ).subscribe(
      cred => this.role = cred.role
    )

		this.route.queryParams.subscribe(params => {
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

}
