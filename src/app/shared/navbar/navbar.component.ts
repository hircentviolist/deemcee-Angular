import { Component, OnInit, Renderer2, ViewChild, ElementRef, Directive, OnDestroy } from '@angular/core';
import { ROUTES } from '../.././sidebar/sidebar.component';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { TitleService } from '../title.service';
import { Observable } from 'rxjs';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { DataForSelect } from 'app/model/data-for-select';
import { DefaultBranchService } from 'app/default-branch.service';
import {NotificationDto} from '../../model/notification-dto';
import {NotificationService} from '../../notification/notification.service';
import {AuthService} from '../../auth/auth.service';
import {take} from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewNotificationComponent } from '../modal/view-notification/view-notification.component';

const misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
}

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit, OnDestroy {
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;
    private _router: Subscription;
    public open = false;
    title$: Observable<string>;
    branch$: Observable<DataForSelect[]>;
    notification$: Observable<NotificationDto[]>;
    defaultBranch$$: Subscription;
    branch_id: number;
    role: string;
    newNotification = false;

    @ViewChild('navbar-cmp', {static: false}) button;

    constructor(
        location: Location,
        private modalService: NgbModal,
        private renderer: Renderer2,
        private element: ElementRef,
        private defaultBranchService: DefaultBranchService,
        private titleService: TitleService,
        private licenseeService: LicenseeService,
        private notificationService: NotificationService,
        private authService: AuthService,
        private router: Router
    ) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        authService.credential$
          .pipe(
            take(1)
          )
          .subscribe(
            auth => {
                this.role = auth.role;
            }
          );
    }

    ngOnInit() {

        this.branch$ = this.licenseeService.getBranchForSelect();
        this.branch$.subscribe(res => {
            console.log('branch$: ', res);
            this.defaultBranchService.defaultBranch$.next(res[0].id);
            this.defaultBranch$$ =
              this.defaultBranchService.defaultBranch$
                .subscribe(branch_id => {
                    if (branch_id) {
                        console.log('default branch:', branch_id);
                        this.branch_id = branch_id;
                        if (this.role === 'principal' || this.role === 'manager' || this.role === 'teacher' ) {
                            this.notification$ = this.notificationService.branchGetNotification(branch_id);
                            this.updateNotificationIndicator();
                        }
                    }
                });
        });


        this.title$ = this.titleService.title$;

        this.listTitles = ROUTES.filter(listTitle => listTitle);

        const navbar: HTMLElement = this.element.nativeElement;
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        if (body.classList.contains('sidebar-mini')) {
            misc.sidebar_mini_active = true;
        }
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
          const $layer = document.getElementsByClassName('close-layer')[0];
          if ($layer) {
            $layer.remove();
          }
        });
    }

    updateNotificationIndicator() {
        this.notification$.subscribe(resp => {
            this.newNotification = resp.some(notification => {
                return notification.status === 'new';
            })
        })
    }

    onChangeDefaultBranch(e) {
        if (!e.target.value) {
            return;
        }
        console.log('branch_id', e.target.value);
        this.defaultBranchService.defaultBranch$.next(e.target.value);
        this.notification$ = this.notificationService.branchGetNotification(e.target.value);
        this.notification$.subscribe(res => {
            console.log('res: ', res);
        })
    }

    minimizeSidebar() {
      const body = document.getElementsByTagName('body')[0];

      if (misc.sidebar_mini_active === true) {
          body.classList.remove('sidebar-mini');
          misc.sidebar_mini_active = false;

      } else {
          setTimeout(function() {
              body.classList.add('sidebar-mini');

              misc.sidebar_mini_active = true;
          }, 300);
      }

      // we simulate the window Resize so the charts will get updated in realtime.
      const simulateWindowResize = setInterval(function() {
          window.dispatchEvent(new Event('resize'));
      }, 180);

      // we stop the simulation of Window Resize after the animations are completed
      setTimeout(function() {
          clearInterval(simulateWindowResize);
      }, 1000);
    }

    isMobileMenu() {
        if (window.outerWidth < 991) {
            return false;
        }
        return true;
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        setTimeout(function() {
            toggleButton.classList.add('toggled');
        }, 500);
        const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
        if (window.innerWidth < 991) {
          mainPanel.style.position = 'fixed';
        }
        html.classList.add('nav-open');
        this.sidebarVisible = true;
    }
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
        const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];

        if (window.innerWidth < 991) {
          setTimeout(function() {
            mainPanel.style.position = '';
          }, 500);
        }
    }
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    }

    readNotification(notification) {
        const modalRef = this.modalService.open(ViewNotificationComponent);
        modalRef.componentInstance.data = {notification};
        
        this.notificationService.branchPutNotification(this.branch_id, {
            'id': notification.id,
            'status': 'seen'
        }).subscribe(res => {
            this.notification$ = this.notificationService.branchGetNotification(this.branch_id);
            this.updateNotificationIndicator();
        })
    }

    getPath() {
        // console.log(this.location);
        return this.location.prepareExternalUrl(this.location.path());
    }

    ngOnDestroy() {
        if (this.defaultBranch$$) {
            this.defaultBranch$$.unsubscribe();
        }
    }
}
