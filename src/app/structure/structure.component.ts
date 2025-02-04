import { Component, OnInit, OnDestroy } from '@angular/core';
import { TitleService } from 'app/shared/title.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.css']
})
export class StructureComponent implements OnInit, OnDestroy {

  active: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: TitleService
  ) {
		this.route.queryParams.subscribe(params => {
			if (params.active) {
				this.active = isNaN(params.active) ? 1 : Number(params.active);
				this.onChangeTab();
			}
		})
  }

  ngOnInit(): void {
    this.titleService.postTitle('Program Structure');
  }

	onChangeTab() {
		this.router.navigate([], {
			queryParams: {
			  	active: this.active
			},
			queryParamsHandling: 'merge',
		});
  }
  
  ngOnDestroy(): void {
  }

}
