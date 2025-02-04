import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { DataForSelect } from 'app/model/data-for-select';
import {NgbDateStruct, NgbModal, NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { DAYS } from 'app/resource/days';
import { distinctUntilChanged, switchMap, map, tap, catchError } from 'rxjs/operators';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { StructureService } from 'app/structure/structure.service';
import { CalendarService } from 'app/calendar/calendar.service';
import { ActivatedRoute, Router, Data } from '@angular/router';
import { DefaultBranchService } from 'app/default-branch.service';
import { Classes } from 'app/model/class-get-dto';
import * as moment from 'moment';
import {ClassLessonModalComponent} from '../class-lesson-modal/class-lesson-modal.component';

@Component({
  selector: 'app-class-form',
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.css']
})
export class ClassFormComponent implements OnInit {

  classForm: FormGroup;

  submitted = false;

  branch_id: number;

  lessons: Classes[];
  lesson_time: string;
  startTime: {
    hour: number,
    minute: number,
  };
  endTime: {
    hour: number,
    minute: number,
  };

  // Data for select
  theme$: Observable<DataForSelect[]>
  selectedTheme: DataForSelect[];
  category$: Observable<any>;
  branch$: Observable<DataForSelect[]>;

  id: string;

  days: DataForSelect[];


  // Datepicker
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;
  date: {year: number, month: number};

  // Timepicker
  start_time: {hour: 8, minute: 30};
  end_time: {hour: 9, minute: 30};

  active: number;

  page: number = 1;
  perPage: number = 20;
  pages = [];

  constructor(
    private config: NgbTimepickerConfig,
    private licenseeService: LicenseeService,
    private structureService: StructureService,
    private calendarService: CalendarService,
    private route: ActivatedRoute,
    private router: Router,
    private defaultBranchService: DefaultBranchService,
    private modalService: NgbModal,
  ) {
    // time spinner
    config.seconds = false;
    config.spinners = false;
    config.minuteStep = 15;
    config.size = 'medium';

    // get route
    this.id = route.snapshot.paramMap.get('id');
    console.log('this.id', this.id);

    this.route.queryParams.subscribe(params => {
      if (params.active) {
        this.active = isNaN(params.active) ? 4 : Number(params.active);
      }
    })
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.id !== 'new') {
      this.populateForm();
    }
    this.populateDataForSelect();

    this.defaultBranchService.defaultBranch$
    .subscribe(branch_id => this.branch_id = branch_id)
  }

  initializeForm() {
    this.classForm = new FormGroup({
      // branch_id: new FormControl('', Validators.required),
      starting_theme_id: new FormControl('', Validators.required),
      label: new FormControl('', Validators.required),
      day: new FormControl('', Validators.required),
      start_time: new FormControl('', Validators.required),
      end_time: new FormControl('', Validators.required),
      commencement_date: new FormControl('', Validators.required),
      category_id: new FormControl('', Validators.required),
    })
  }

  populateDataForSelect() {
    this.days = DAYS;
    this.category$ = this.structureService.getAllCategories();
    this.branch$ = this.licenseeService.getBranchForSelect();
    this.theme$ =
    this.classForm.get('category_id').valueChanges
    .pipe(
      distinctUntilChanged(),
      switchMap(category_id =>
        this.structureService.getAllLessonTheme(
          category_id,
          null,
          this.classForm.get('commencement_date').value ?
          this.convertDatePickerFormatForSubmit(this.classForm.get('commencement_date').value) :
          null
        )
        .pipe(
          map(themes => themes
            .filter(t => {
              return t.category.id === +category_id;
            })
            .map(t => {
              return {
                id: t.id,
                name: t.name
              }}
            )
          ),
          catchError(err => {
            alert(err.error.message)
            return EMPTY;
          }),
          tap(themes => this.selectedTheme = themes)
        )
      )
    );
  }


  // addBranchItem() {
  //   const addEvent = this.classForm.get('lessons') as FormArray;
  //   addEvent.push(new FormGroup({
  //     lesson_name: new FormControl(''),
  //     date: new FormControl(''),
  //     theme: new FormControl('')
  //   }));
  // }

  clearLessons() {
    const formArray = this.classForm.get('lessons') as FormArray;
    this.classForm.reset();
    this.classForm.get('lessons').value.forEach((e, i) => {
      formArray.removeAt(0)
    })
  }

  populateForm() {

    this.theme$ =
    this.classForm.get('category_id').valueChanges
    .pipe(
      distinctUntilChanged(),
      switchMap(category_id =>
        this.structureService.getAllLessonTheme()
        .pipe(
          map(themes => themes
            .filter(t => {
              return t.category.id === +category_id;
            })
            .map(t => {
              return {
                id: t.id,
                name: t.name
              }}
            )
          ),
          tap(themes => this.selectedTheme = themes)
        )
      )
    );

    this.getClassLesson();
    // this.clearLessons();
  }

  getClassLesson() {
    this.calendarService.getOneClass(+this.id, {page: this.page, per_page: this.perPage})
    .subscribe((data) => {
      this.initPagination(data.lessons)
      const lessonArray = data.lessons.data.map(l => {
        return {
          lesson_name: l.lesson ? l.lesson.name : '',
          date: l.date,
          theme: l.lesson ? l.lesson.theme.name : ''
        }
      })

      this.lesson_time = data.start_time + ' - ' + data.end_time;
      lessonArray.forEach(() => {
        // this.addBranchItem();
      });
      
      this.classForm.patchValue({
        // branch_id: data.branch_id ? data.branch_id : this.branch_id,
        starting_theme_id: data.lessons.data[0].lesson.theme.id || null,
        day: data.day,
        start_time: this.convertToTimePickerFormat(data.start_time),
        end_time: this.convertToTimePickerFormat(data.end_time),
        commencement_date: this.convertToDatePickerFormat(data.commencement_date),
        category_id: +data.category.id,
        label: data.label,
      });

      this.startTime = this.convertToTimePickerFormat(data.start_time);
      this.endTime = this.convertToTimePickerFormat(data.end_time);

      data.lessons.data.map(lesson => {
        lesson.start_datetime = lesson.date + ' ' + data.start_time;
        lesson.end_datetime = lesson.date + ' ' + data.end_time;
        lesson.past = moment().isAfter(lesson.end_datetime);
      });
      this.lessons = data.lessons.data;
      console.log('this.lessons: ', this.lessons);
    })
  }

  onSubmit() {
    this.submitted = true;
    if (!this.classForm.valid) {
      alert('invalid form');
      console.log(this.classForm);
      return;
    }

    const body = this.classForm.value;
      body.start_time = this.convertTimePickerFormatForSubmit(body.start_time);
      body.end_time = this.convertTimePickerFormatForSubmit(body.end_time);
      body.commencement_date = this.convertDatePickerFormatForSubmit(body.commencement_date);
      body.starting_theme_id = +body.starting_theme_id;
      body.branch_id = +this.branch_id;
      body.category_id = +body.category_id;
      body.max_class_size = 6;

    if (this.isUpdate()) {
      this.calendarService.updateClass(+this.id, body)
      .subscribe(
        () => {
          console.log('Class Updated')
          this.router.navigate(['..'], {
            relativeTo: this.route,
            queryParams: {
              active: this.active
            },
            queryParamsHandling: 'merge',
          })
        },
        err => {
          console.error(err);
          alert(err.error.message);
        }
      )


    } else {
      // add new class
      this.calendarService.addClass(body)
      .subscribe(
        resp => {
          console.log('Class Created')
          this.router.navigate(['..'], {
            relativeTo: this.route,
            queryParams: {
              active: this.active
            },
            queryParamsHandling: 'merge',
          })
        },
        err => {
          console.error(err);
          alert(err.error.message);
        }
      )
    }

  }

  convertDatePickerFormatForSubmit(date: {year: number, month: number, day: number}) {
    // Converts {year: 2020, month: 10, day: 25} to 2020-10-25 for submit to server
    return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
  }

  convertToTimePickerFormat(time: string) {
    // Converts 12:00 to {hour: 12, minute: 0} for timepicker use

    const timeArray = time.split(':');
    return {
      hour: +timeArray[0],
      minute: +timeArray[1],
    }
  }

  convertTimePickerFormatForSubmit(time: {hour: number, minute: number}) {
    // Converts {hour: 14, minute: 30} to 14:30 for submit to server
    return ('0' + time.hour.toString()).slice(-2) + ':' + ('0' + time.minute.toString()).slice(-2);
  }

  convertToDatePickerFormat(date: string) {
    // Converts 2020-10-25 to {year: 2020, month: 10, day: 25} for datepicker use

    const dateArray = date.split('-');
    return {
      year: +dateArray[0],
      month: +dateArray[1],
      day: +dateArray[2],
    }

  }

  showClassRecord(lesson) {
    // [routerLink]="['lesson', lesson.id]"
    if (lesson.status === 'COMPLETED') {
      this.router.navigate(['lesson', lesson.id], {relativeTo: this.route})
    } else {
      const modalRef = this.modalService.open(ClassLessonModalComponent);
      const id = lesson.id;
      const branch_id = this.branch_id;
      console.log('showClassRecord, lesson: ', lesson);
      modalRef.componentInstance.data = {id, branch_id, lesson};
      modalRef.result.then(res => {
        console.log('res: ', res);
        if (res) {
          if (lesson.status === 'PENDING') {
            this.calendarService.startClassLesson(id, branch_id, res).subscribe(result => {
              console.log('startClassLesson: ', result);
              this.ngOnInit();
            })
          } else if (lesson.status === 'IN_PROGRESS') {
            this.calendarService.updateClassLesson(id, branch_id, res).subscribe(result => {
              console.log('updateClassLesson: ', result);
              this.ngOnInit();
            })
          }
        }
      })
    }
  }

  isUpdate(): boolean {
    return this.id !== 'new';
  }

  initPagination(response) {
    this.page = +response.current_page;
    this.pages = [];

    if (response.data.length) {
      response.data.forEach((lesson, i) => {
        lesson.number = (i + 1) + ((this.page - 1 ) * this.perPage);
      });

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
      this.getClassLesson();
    }
  }

  updateLabel() {
    setTimeout(() => {
      const day = this.classForm.get('day').value;
      const start = this.startTime ? this.convertTimePickerFormatForSubmit(this.startTime) : '';
      const end = this.endTime ? this.convertTimePickerFormatForSubmit(this.endTime) : '';
      
      this.classForm.get('label').setValue(`${day} ${start} ${end ? '-' : ''} ${end}`)
      console.log(this.startTime);
    }, 1)
  }
}
