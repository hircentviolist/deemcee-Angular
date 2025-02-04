import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2'
import PerfectScrollbar from 'perfect-scrollbar';
import { CalendarService } from '../calendar.service';
import { Calendar } from 'app/model/calendar';
import { Observable, Subscription } from 'rxjs';
import { DataForSelect } from 'app/model/data-for-select';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../modal/info-modal/info-modal.component';
import { DefaultBranchService } from 'app/default-branch.service';
import { CalendarOptions, EventSourceInput } from '@fullcalendar/angular';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

const NEXT = 'next';
const PREV = 'prev';
const CLASS_COLOR = {
	branchHoliday: 'red',
  hqHoliday: 'blue',
	branchEvent: 'orange',
	hqEvent: 'lightgreen',
  class: 'yellow',
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class Calendar2Component implements OnInit {

  @ViewChild('calendar') calendarComponent;

  ourCalendar: Calendar[];
  branch$: Observable<DataForSelect[]>;
  defaultBranch$$: Subscription;
  branch_id: number;
  currentViewMonth: number;
  currentViewYear: number;
  calendarOptions: CalendarOptions;
  now = moment();
  updateCalendarTimer: any;

	calendarHints = [
		{label: 'Branch Holiday', color: CLASS_COLOR.branchHoliday},
		{label: 'HQ Holiday', color: CLASS_COLOR.hqHoliday},
		{label: 'Branch Event', color: CLASS_COLOR.branchEvent},
		{label: 'HQ Event', color: CLASS_COLOR.hqEvent},
		// {label: 'Class', color: CLASS_COLOR.class},
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private licenseeService: LicenseeService,
    private modalService: NgbModal,
    private defaultBranchService: DefaultBranchService,
    private calendarService: CalendarService) {
      this.removeUnnecessaryQueryParams(1);
  }


  ngOnInit() {

    this.branch$ = this.branch$ = this.licenseeService.getBranchForSelect();
    this.defaultBranch$$ =
    this.defaultBranchService.defaultBranch$
    .subscribe(branch_id => {
      if (branch_id) {
        this.branch_id = branch_id;
        this.formatCalendar(this.now.format('M'), this.now.format('YYYY'));
      }
    })

  }

  removeUnnecessaryQueryParams(pageIndex) {
		this.route.queryParams.subscribe(params => {
      if (+params.active === pageIndex) {
        this.router.navigate([], {
          queryParams: {
            active: params.active,
            year_id: null,
            holiday_id: null,
            branch_id: null,
          },
          queryParamsHandling: 'merge',
        });
      }
    })
  }

  onSelectBranch(e) {
    if (!e.target.value) {
      return;
    }
    this.branch_id = e.target.value;
    this.formatCalendar(this.now.format('M'), this.now.format('YYYY'))
  }

  formatCalendar(month, year) {
    this.calendarService.getCalendar(this.branch_id, month, year)
    .subscribe(
      cal => {
        this.ourCalendar = cal;
        this.showCalendar(
          cal.map(c => {
            const startDate = moment(c.start_datetime).format('YYYY-MM-DD');
            const endDate = moment( c.end_datetime).format('YYYY-MM-DD');
            
            c.start = c.start_datetime;
            c.end = c.end_datetime;
            c.allDay = startDate === endDate ? c.is_all_day : false;

            delete c.start_datetime;
            delete c.end_datetime;
            delete c.is_all_day;

            if (c.type === 'branch_event') {
              return Object.assign({color: 'orange'}, c)
            } else if (c.type === 'hq_event') {
              return Object.assign({color: 'lightgreen'}, c)
            } else if (c.type === 'branch_holiday') {
              return Object.assign({color: 'red'}, c)
            } else if (c.type === 'hq_holiday') {
              return Object.assign({color: 'blue'}, c)
            } else if (c.type === 'class_lesson') {
              return Object.assign({color: 'yellow'}, c)
            } else {
              return Object.assign({color: 'gray'}, c)
            }
          })
          );
      },
      err => console.error(`Failed to load calendar. ${JSON.stringify(err.error)}`)
    )
  }

  showCalendar(ourCalendar: EventSourceInput) {
    this.calendarOptions = {
      dayMaxEvents: 4,
      height: '85vh',
      fixedWeekCount: false,
      customButtons: {
        nextMonth: {
          text: '>',
          click: () => this.handleButton('next')
        },
        prevMonth: {
          text: '<',
          click: () => this.handleButton('prev')
        }
      },
      headerToolbar: {
        left: 'title',
        center: '',
        right: 'today prevMonth,nextMonth'
      },
      events: ourCalendar,
      initialView: 'dayGridMonth',
      eventClick: (info) => {
        const modalRef = this.modalService.open(InfoModalComponent);
        modalRef.componentInstance.data = info.event;
      },
      eventMouseEnter: (info) => info.el.style.cursor = 'pointer'
    };
  }

  handleButton(action) {
    const calendar = this.calendarComponent.getApi();

    if (action === NEXT) {
      calendar.next();
      this.updateCalendar(calendar);
    } else if (action === PREV) {
      calendar.prev();
      this.updateCalendar(calendar);
    }
  }

  updateCalendar(calendar) {
    const month = calendar.getDate().getMonth() + 1;
    const year = calendar.getDate().getFullYear();

    clearTimeout(this.updateCalendarTimer);

    this.updateCalendarTimer = setTimeout(() => {
      this.formatCalendar(month, year);
    }, 350);
  }

  ngOnDestroy(): void {
    this.defaultBranch$$.unsubscribe();
  }
}
