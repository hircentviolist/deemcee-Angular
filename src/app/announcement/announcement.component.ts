import { Component, OnInit } from '@angular/core';
import {TitleService} from '../shared/title.service';
import {Observable} from 'rxjs';
import {AnnouncementService} from './announcement.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateAnnouncementModalComponent} from './create-announcement-modal/create-announcement-modal.component';
import {AnnouncementDto} from '../model/announcement-dto';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {

  allAnnouncement$: Observable<AnnouncementDto[]>;
  constructor(
    private titleService: TitleService,
    private announcementService: AnnouncementService,
    private modalService: NgbModal,
  ) {
    this.titleService.postTitle('Announcement')
  }

  ngOnInit(): void {
    this.allAnnouncement$ = this.announcementService.getAllAnnouncement();
    this.allAnnouncement$.subscribe(res => {
    })
  }

  createNew() {
    const modalRef = this.modalService.open(CreateAnnouncementModalComponent);
    modalRef.result.then(resp => {
      this.announcementService.createAnnouncement(resp).subscribe(res => {
        this.ngOnInit();
      })
    }, error => {
      console.log('createNew, error: ', error);
    })
  }

  update(announcement) {
    const modalRef = this.modalService.open(CreateAnnouncementModalComponent);
    modalRef.componentInstance.data = {announcement};
    modalRef.result.then(resp => {
      resp.id = announcement.id;
      this.announcementService.updateAnnouncement(resp).subscribe(res => {
        this.ngOnInit();
      })
    }, error => {
      console.log('update, error: ', error);
    })
  }
}
