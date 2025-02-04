import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouteInfo } from 'app/sidebar/sidebar.component';
import { ModuleControlService } from 'app/shared/module-control.service';
import { take } from 'rxjs/operators';
import { AuthService } from 'app/auth/auth.service';
import {Observable, Subscription} from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { TitleService } from 'app/shared/title.service';
import {AnnouncementDto} from '../../model/announcement-dto';
import {NguCarouselConfig} from '@ngu/carousel';

@Component({
  selector: 'app-menu',
  templateUrl: '../../shared/menu/menu.component.html',
  styleUrls: ['../../shared/menu/menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  dashboardTitle: string;
  routeInfo: RouteInfo[];
  module$$: Subscription;
  announcement$: Observable<AnnouncementDto[]>;
  announcementImages: any[];

  announcementCarousel: NguCarouselConfig;
  announcementItems: any[];

  constructor(
    private moduleControlService: ModuleControlService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private titleService: TitleService,
  ) { }

  ngOnInit(): void {
    this.dashboardTitle = 'HQ Dashboard';
    this.titleService.postTitle(this.dashboardTitle);
    this.routeInfo = this.moduleControlService.getModules();
    console.log('this.routeInfo: ', this.routeInfo);
  }

  ngOnDestroy() {
    if (this.module$$) {
      this.module$$.unsubscribe();
    }
  }

  announcementCarouselLoad(e) {
    // console.log(e);
  }

  onNavigate(path: string) {
    this.router.navigate(['../', path], {relativeTo: this.route})
  }

}
