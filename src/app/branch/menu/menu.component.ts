import { Component, OnInit } from '@angular/core';
import { RouteInfo } from 'app/sidebar/sidebar.component';
import { ModuleControlService } from 'app/shared/module-control.service';
import { take } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { TitleService } from 'app/shared/title.service';
import {AnnouncementDto} from '../../model/announcement-dto';
import {AnnouncementService} from '../../announcement/announcement.service';
import {Observable, Subscription} from 'rxjs';
import {DefaultBranchService} from '../../default-branch.service';
import {LicenseeService} from '../../hq/licensee/licensee.service';
import {DataForSelect} from '../../model/data-for-select';
import {NguCarouselConfig} from '@ngu/carousel';

@Component({
  selector: 'app-menu',
  templateUrl: '../../shared/menu/menu.component.html',
  styleUrls: ['../../shared/menu/menu.component.css']
})
export class MenuComponent implements OnInit {

  dashboardTitle: string;
  branch_id: number;
  routeInfo: RouteInfo[];
  announcement$: Observable<AnnouncementDto[]>;
  branch$: Observable<DataForSelect[]>;
  defaultBranch$$: Subscription;
  announcementImages = [];

  announcementCarousel: NguCarouselConfig;
  announcementItems: any[];

  constructor(
    private licenseeService: LicenseeService,
    private moduleControlService: ModuleControlService,
    private defaultBranchService: DefaultBranchService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: TitleService,
    private announcementService: AnnouncementService,
  ) { }

  ngOnInit(): void {
    this.branch$ = this.branch$ = this.licenseeService.getBranchForSelect();
    this.defaultBranch$$ = this.defaultBranchService.defaultBranch$
      .subscribe(branch_id => {
        if (branch_id) {
          console.log('branch_id: ', branch_id);
          this.branch_id = branch_id;
          this.announcement$ = this.announcementService.getBranchAnnouncements(this.branch_id);
          this.announcement$.subscribe(res => {
            console.log('announcement: ', res);
            res.map(announcement => {
              this.announcementImages.push(announcement);
            })
          })
        }
      });
    this.dashboardTitle = 'Branch Dashboard';
    this.titleService.postTitle(this.dashboardTitle);
    this.routeInfo = this.moduleControlService.getModules();
    console.log('this.routeInfo: ', this.routeInfo);
    this.announcementCarousel = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
      slide: 1,
      speed: 500,
      point: {
        visible: false
      },
      load: 1,
      touch: true,
      loop: true,
      custom: 'banner',
      velocity: 0,
      easing: 'cubic-bezier(0, 0, 0.2, 1)'
    };
  }

  announcementCarouselLoad(e) {
    // console.log(e);
  }

  onNavigate(path: string) {
    this.router.navigate(['../', path], {relativeTo: this.route})
  }


}
