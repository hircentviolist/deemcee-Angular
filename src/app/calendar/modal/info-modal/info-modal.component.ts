import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/auth/auth.service';
import { Credentials } from 'app/model/credentials';
import { take } from 'rxjs/operators';
import { EventGetDto } from 'app/model/event-get-dto';
import { CalendarService } from 'app/calendar/calendar.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { HolidayGetDto } from 'app/model/holiday-get-dto';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.css']
})
export class InfoModalComponent implements OnInit, OnChanges {

  cred: Credentials;
  event_: EventGetDto;
  holidayYear: HolidayGetDto;
  startDate: any;
  endDate: any;

  @Input() public data;

  constructor(
    private authService: AuthService,
    private calendarService: CalendarService,
    private router: Router,
    private route: ActivatedRoute,
    public activeModal: NgbActiveModal) {
      this.authService
      .credential$
      .pipe(
        take(1)
      ).subscribe(cred => this.cred = cred)
    }

  ngOnInit(): void {
    this.startDate = this.data.start ? moment(this.data.start) : null;
    this.endDate = this.data.end ? moment(this.data.end) : null;
    this.fetchData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.fetchData();
  }

  fetchData() {
    if (!this.data) {
      return;
    }
    if (['branch_event', 'hq_event'].includes(this.data.extendedProps.type)) {
      this.calendarService.getOneEvent(+this.data.id)
        .subscribe(d => this.event_ = d);
    }

    if (['branch_holiday', 'hq_holiday'].includes(this.data.extendedProps.type)) {
      this.calendarService.getOneHoliday(+this.data.extendedProps.eventable_id)
        .subscribe(d => this.holidayYear = d);
    }
  }

  onClose() {
    this.activeModal.close();
  }

  onEdit() {
    console.log({holidayYear: this.holidayYear})
    if (!this.data) {
      return;
    }
    if (['branch_event', 'hq_event'].includes(this.data.extendedProps.type)) {
      this.activeModal.close();
      this.router.navigate(['hq', 'calendar', 'event', this.data.id]);
    }

    if (['branch_holiday', 'hq_holiday'].includes(this.data.extendedProps.type)) {
      this.activeModal.close();
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          active: 2,
          year_id: this.holidayYear.id,
          holiday_id: this.holidayYear.dates.find(d => +d.id === +this.data.id).id,
          branch_id: this.holidayYear.branch.id
        },
        queryParamsHandling: 'merge',
        skipLocationChange: true
      });
    }
  }


}
