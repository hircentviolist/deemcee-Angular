import { Component, OnInit } from '@angular/core';
import {TitleService} from '../shared/title.service';
import {NotificationService} from './notification.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateNotificationModalComponent} from './create-notification-modal/create-notification-modal.component';
import {Observable} from 'rxjs';
import {NotificationDto, NotificationListDto} from '../model/notification-dto';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  allNotification$: Observable<NotificationListDto>;
  notifications: NotificationDto[];
  page: number = 1;
  perPage: number = 20;
  pages = [];

  constructor(
    private titleService: TitleService,
    private notificationService: NotificationService,
    private modalService: NgbModal,
  ) {
    this.titleService.postTitle('Notification')
  }

  ngOnInit(): void {
    this.getNotifications();
  }

  getNotifications() {
    this.allNotification$ = this.notificationService.getAllNotifications(this.perPage, this.page);
    this.allNotification$.subscribe(res => {
      console.log(res.data);
      res.data.forEach((notificationGroup: any) => {
        const sentTo = ['', '', ''];

        notificationGroup.notifications.forEach(notification => {
          if (notification.notifiable_type === 'App\\Models\\User' && !notification.notifiable.is_deshop_user) {
            sentTo[0] = 'DeLive Parents';
          }

          if (notification.notifiable_type === 'App\\Models\\User' && notification.notifiable.is_deshop_user) {
            sentTo[1] = 'DeShop Parents';
          }

          if (notification.notifiable_type === 'App\\Models\\Branch') {
            sentTo[2] = 'Branches';
          }
        });
        
        notificationGroup.sent_to = sentTo.filter(Boolean);
      })
      this.notifications = res.data;
      this.initPagination(res);
    })
  }

  initPagination(response) {
    this.page = +response.current_page;
    this.pages = [];

    if (response.data.length) {
      for (let i = 0; i < response.last_page; i++) {
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
      this.getNotifications();
    }
  }

  createNew() {
    const modalRef = this.modalService.open(CreateNotificationModalComponent);
    modalRef.result.then(resp => {
      console.log('resp: ', resp);
      this.notificationService.createNotification(resp).subscribe(res => {
        this.getNotifications();
        console.log('res - ', res);
      })
    }, err => {})
  }

  view(notificationGroup) {
    const modalRef = this.modalService.open(CreateNotificationModalComponent);
    modalRef.componentInstance.data = {notificationGroup};
  }

}
