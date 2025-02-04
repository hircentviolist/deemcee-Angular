import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import PerfectScrollbar from 'perfect-scrollbar';
import { TitleService } from 'app/shared/title.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'calendar-cmp',
    templateUrl: 'calendar.component.html'
})

export class CalendarComponent implements OnInit {

  active = 1;

  constructor(
    private titleService: TitleService,
		private router: Router,
		private route: ActivatedRoute,
  ) {
    this.titleService.postTitle('Calendar / Holidays / Events')
    
		this.route.queryParams.subscribe(params => {
			if (params.active) {
				this.active = isNaN(params.active) ? 1 : Number(params.active);
				this.onChangeTab();
			}
		})
  }

  ngOnInit() {

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
