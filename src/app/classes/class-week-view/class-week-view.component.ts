import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventSourceInput } from '@fullcalendar/angular';
import { CalendarService } from 'app/calendar/calendar.service';
import { DefaultBranchService } from 'app/default-branch.service';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { ClassListItemDto } from 'app/model/class-list-item-dto';
import { DataForSelect } from 'app/model/data-for-select';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClassLessonModalComponent } from '../class-lesson-modal/class-lesson-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/auth/auth.service';
import { take } from 'rxjs/operators';

const NEXT = 'next';
const PREV = 'prev';
const CLASS_COLOR = {
  kiddo: '#D6DF1F',
  kids: '#47B856',
  superkids: '#00AEEE'
}
@Component({
  selector: 'app-class-week-view',
  templateUrl: './class-week-view.component.html',
  styleUrls: ['./class-week-view.component.css']
})
export class ClassWeekViewComponent implements OnInit {

  @ViewChild('calendar') calendarComponent;
  calendarOptions: CalendarOptions;
  branch_id: number;
  branch$: Observable<DataForSelect[]>;
  classes: ClassListItemDto[];
  defaultBranch$$: Subscription;

  startDate: moment.Moment = moment().startOf('isoWeek');
  endDate: moment.Moment = moment().endOf('isoWeek').add(1, 'day');

  inputStartDate: NgbDate;
  inputEndDate: string;

  isShowCalendar = false;

  calendarHints = [
    {label: 'Kiddo', color: CLASS_COLOR.kiddo},
    {label: 'Kids', color: CLASS_COLOR.kids},
    {label: 'Super Kids', color: CLASS_COLOR.superkids},
  ];
  startDateChangeTimer: any;
  role: string;
  isLoading = true;

  constructor(
    private licenseeService: LicenseeService,
    private defaultBranchService: DefaultBranchService,
    private calendarService: CalendarService,
    private location: Location,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    this.authService.credential$
      .pipe(
        take(1)
      )
      .subscribe(
        auth => {
          this.role = auth.role;
        }
      );
  }

  ngOnInit(): void {
    this.branch$ = this.branch$ = this.licenseeService.getBranchForSelect();
    this.defaultBranch$$ = this.defaultBranchService.defaultBranch$.subscribe(branch_id => {
      if (branch_id) {
        this.branch_id = branch_id;
        this.getClasses();
      }
    });
  }

  getClasses() {
    this.isLoading = true;
    this.inputStartDate = new NgbDate(
      +this.startDate.format('YYYY'),
      +this.startDate.format('MM'),
      +this.startDate.format('DD')
    );
    this.inputEndDate = this.endDate.clone().subtract(1, 'day').format('YYYY-MM-DD');

    this.calendarService.getAllClasses(this.branch_id, this.startDate, this.endDate).subscribe(
      data => {
        const lessons = data.map(d => {
          return this.formatData(d);
        })
        this.showCalendar(lessons);
      },
      error => {
        console.error(error);
        this.showCalendar();
        alert(`Unable to fetch lessons. ${JSON.stringify(error.error)}`)
      }
    )
  }

  formatData(data) {
    const startTime = moment(data.de_class.start_time);
    const endTime = moment(data.de_class.end_time);

    const teacherName = data.teacher ? data.teacher.full_name : '';
    const coTeacherName = data.coTeacher ? data.coTeacher.full_name : '';

    const attendedStudents = [];
    data.students.map(student => {
      if (student.has_attended) {
        attendedStudents.push(student);
      }
    });

    return {
      id: data.id,
      title: data.lesson.theme.display_name,
      start: `${data.date} ${startTime.format('HH:mm:ss')}`,
      end: `${data.date} ${endTime.format('HH:mm:ss')}`,
      allDay: false,

      // extendedProps
      startTimeString: startTime.format('hh:mma'),
      endTimeString: endTime.format('hh:mma'),
      bgColor: CLASS_COLOR[data.de_class.category.name],
      lessonName: `Lesson ${data.lesson.order}`,
      teacherName: teacherName ?? coTeacherName,
      enrolledPerMax: `${attendedStudents.length}/${data.students.length}`,
      lesson: data,
      category: data.de_class.category.id,
      label: data.de_class.label,
    }
  }

  showCalendar(lessons: EventSourceInput = []) {
    this.isShowCalendar = true;

    setTimeout(() => {
      this.calendarComponent.getApi().changeView('dayGrid', {
        start: this.startDate.format('YYYY-MM-DD'),
        end: this.endDate.format('YYYY-MM-DD'),
      });
    })

    this.calendarOptions = {
      headerToolbar: {
        left: '',
        center: '',
        right: ''
      },
      events: lessons,
      initialView: 'dayGridMonth',
      eventOrder: ['start', 'category'],
      eventClick: info => this.showClassRecord(info.event),
      eventMouseEnter: info => info.el.style.cursor = 'pointer',
      eventContent: info => this.renderEventComponent(info.event)
    };
    this.isLoading = false;
  }

  handleButton(action: 'next' | 'prev') {
    const date = moment(this.convertDateFormat(this.inputStartDate));

    if (action === NEXT) {
      date.add(1, 'week');

      this.inputStartDate = new NgbDate(
        +date.format('YYYY'),
        +date.format('MM'),
        +date.format('DD'),
      );
    } else if (action === PREV) {
      date.subtract(1, 'week');

      this.inputStartDate = new NgbDate(
        +date.format('YYYY'),
        +date.format('MM'),
        +date.format('DD'),
      );
    }

    clearTimeout(this.startDateChangeTimer);

    this.startDateChangeTimer = setTimeout(() => {
      this.onStartDateChange();
    }, 350);
  }

  renderEventComponent({title, extendedProps}): {html: string} {
    return {
      html: `
				<div style="font-size: 12px; height: 100%; width: 100%; color: black; padding: 5px; background-color: ${extendedProps.bgColor};">
					<div style="font-size: 13px; margin-bottom: 3px">
						${extendedProps.startTimeString} - ${extendedProps.endTimeString}
					</div>
					<div style="font-size: 10px; margin-bottom: 3px">
						Label: ${extendedProps.label}
					</div>
					<div style="margin-top: 5px; margin-bottom: 5px">
						<span style="width: 100%; font-size: 15px; display: block; white-space: nowrap;text-overflow: ellipsis;padding-right: 3px;overflow: hidden;font-weight: bold;">
							${title}
						</span>
					</div>
					<div style="display: flex; flex-direction: row; margin-bottom: 5px">
						<span style="width: 60%; font-size: 12px; flex: 1">
							${extendedProps.lessonName}
						</span>
						<span style="font-size: 12px; flex: 1; text-align: right">
							${extendedProps.enrolledPerMax}
						</span>
					</div>
					<div>
					<div>
						<span style="flex: 3; width: 50%;white-space: nowrap;text-overflow: ellipsis;padding-right: 3px;overflow: hidden">
							${extendedProps.teacherName}
						</span>
					</div>
				</div>
			`
    }
  }

  onStartDateChange() {
    setTimeout(() => {
      const date = moment(this.convertDateFormat(this.inputStartDate));

      this.startDate = date.startOf('isoWeek');
      this.endDate = date.clone().endOf('isoWeek').add(1, 'day');

      this.getClasses();
    })
  }

  convertDateFormat(date: {year: number, month: number, day: number}) {
    return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
  }

  showClassRecord({extendedProps}) {
    const lesson = extendedProps.lesson;

    if (lesson.status === 'COMPLETED') {
      const module = ['superadmin', 'admin'].includes(this.role) ? 'hq' : 'branch';
      this.router.navigate([`${module}/class/${lesson.de_class.id}/lesson`, lesson.id])
    } else {
      const modalRef = this.modalService.open(ClassLessonModalComponent);
      const id = lesson.id;
      const branch_id = this.branch_id;

      modalRef.componentInstance.data = {id, branch_id, lesson};
      modalRef.result.then(res => {
        if (res) {
          if (lesson.status === 'PENDING') {
            this.calendarService.startClassLesson(id, branch_id, res).subscribe(result => {
              this.getClasses();
            })
          } else if (lesson.status === 'IN_PROGRESS') {
            this.calendarService.updateClassLesson(id, branch_id, res).subscribe(result => {
              this.getClasses();
            })
          }
        }
      })
    }
  }

  goBack() {
    this.location.back();
  }
}
