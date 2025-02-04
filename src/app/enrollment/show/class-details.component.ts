import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from 'app/enrollment.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ClassLessonDto } from '../../model/class-lesson-dto';
import { ThemeLessonItem } from '../../model/theme-lesson-item';
import * as moment from 'moment';
import { DefaultBranchService } from '../../default-branch.service';
import { Grade } from 'app/model/grade';
import { StructureService } from 'app/structure/structure.service';
import { AuthService } from 'app/auth/auth.service';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FreezeComponent } from '../modal/freeze/freeze.component';
import { EnrollmentListItem } from 'app/model/enrollment-list-item';
import { ChangeClassComponent } from '../modal/change-class/change-class.component';
import { EditExtendComponent } from '../modal/edit-extend/edit-extend.component';

@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.css'],
})
export class ClassDetailsComponent implements OnInit {
  enrollment$: Observable<any>;
  id: number;
  selectedTheme = 0;
  status: string;

  classLessons: ClassLessonDto[];
  themeLessons = [];
  mappedLessonKey = [];
  branch_id: number;
  studentName: string;
  studentGrade: string;
  grade$: Observable<Grade[]>;
  classDetailsCount;
  role: String;
  enrolment: EnrollmentListItem;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private enrollmentService: EnrollmentService,
    // private structureService: StructureService,
    private defaultBranchService: DefaultBranchService
  ) {
    this.authService.credential$.pipe(take(1)).subscribe((auth) => {
      this.role = auth.role;
    });
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params.id;
    this.status = this.route.snapshot.params.status;
    // this.grade$ = this.structureService.getAllGrades();
    this.defaultBranchService.defaultBranch$.subscribe((branch_id) => {
      if (branch_id) {
        this.branch_id = branch_id;
      }
    });
    if (this.id) {
      this.enrollment$ =
        this.status === 'past'
          ? this.enrollmentService.getOneEnrolmentById(this.id, this.branch_id)
          : this.enrollmentService.getById(this.id, this.branch_id);

      this.enrollment$.subscribe((enrolment) => {
        this.mappedLessonKey = [];
        this.themeLessons = [];
        this.enrolment = enrolment;
        // this.studentName = enrolment.name;
        // this.grade$.subscribe((grades) => {
        // 	this.studentGrade = grades.find((grade) => {
        // 		return +grade.id === +enrolment.grade_id;
        // 	}).name;
        // });

        // this.classDetailsCount = {
        // 	remaining_class_count: enrolment.remaining_class_count,
        // 	total_attended_count: enrolment.total_attended_count,
        // 	total_rescheduled_count: enrolment.total_rescheduled_count,
        // 	total_absent_count: enrolment.total_absent_count,
        // 	total_class_count: enrolment.total_class_count,
        // 	freezed_class_count: enrolment.freezed_class_count,
        // };

        this.classLessons = enrolment.class_lesson.sort(this.compareDatetime);
        const mappedLessons = [];
        const themeRecurred = [];
        let prevThemeId = 0;
        this.classLessons.map((lesson) => {
          lesson.date = moment(lesson.start_datetime).format('YYYY-MM-DD');
          lesson.start_datetime = moment(lesson.start_datetime).format('hh:mm a');
          lesson.end_datetime = moment(lesson.end_datetime).format('hh:mm a');
          // check if current theme is same with the previous one
          if (lesson.theme_id === prevThemeId) {
            mappedLessons[String(lesson.theme_id) + '-' + themeRecurred[String(lesson.theme_id)]].push(lesson);
          } else {
            // check if current theme has recurred
            if (Object.keys(themeRecurred).includes(String(lesson.theme_id))) {
              themeRecurred[String(lesson.theme_id)] = themeRecurred[String(lesson.theme_id)] + 1;
            } else {
              themeRecurred[String(lesson.theme_id)] = 0;
            }
            // check if current theme has a mapkey
            if (!Object.keys(mappedLessons).includes(String(lesson.theme_id) + '-' + themeRecurred[String(lesson.theme_id)])) {
              mappedLessons[String(lesson.theme_id) + '-' + themeRecurred[String(lesson.theme_id)]] = [];
              this.mappedLessonKey.push(String(lesson.theme_id) + '-' + themeRecurred[String(lesson.theme_id)]);
            }
            mappedLessons[String(lesson.theme_id) + '-' + themeRecurred[String(lesson.theme_id)]].push(lesson);
          }
          prevThemeId = lesson.theme_id;
        });
        this.mappedLessonKey.map((key) => {
          const themeLessons = mappedLessons[key];
          let attendedCount = 0;
          themeLessons.map((themeLesson) => {
            if (themeLesson.has_attended) {
              attendedCount++;
            }
          });
          const themeLessonItem: ThemeLessonItem = {
            has_attended: attendedCount,
            theme_id: themeLessons[0].theme_id,
            theme_name: themeLessons[0].theme_name,
            lessons: themeLessons,
          };
          this.themeLessons.push(themeLessonItem);
        });
      });
    }
  }

  public callNgOnInit() {
    this.ngOnInit();
  }

  get latestThemeLessons(): any[] {
    return this.themeLessons;
  }

  compareDatetime(a, b) {
    const dateA = a.start_datetime;
    const dateB = b.start_datetime;

    let comparison = 0;
    if (dateA > dateB) {
      comparison = 1;
    } else if (dateA < dateB) {
      comparison = -1;
    }
    return comparison;
  }

  onSelectTheme(i: number) {
    this.selectedTheme = i;
  }

  capitalise(string) {
    const splitStr = string.toLowerCase().split(' ');

    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(' ');
  }

  onFreeze() {
    const modalRef = this.modalService.open(FreezeComponent);
    const enrolment = this.enrolment;
    modalRef.componentInstance.data = { enrolment };
    modalRef.result
      .then((result) => {
        if (result) {
          console.log('result: ', result);
          this.enrollmentService.freeze(enrolment.enrolment.id, result).subscribe(
            (res) => {
              alert('Freeze Successful');
              this.ngOnInit();
            },
            (err) => {
              console.log('err: ', err);
              alert(err.error.message);
            }
          );
        }
      })
      .catch((error) => {
        console.log('onFreeze, error: ', error);
      });
  }

  onUnfreeze() {
    const modalRef = this.modalService.open(FreezeComponent);
    const enrolment = this.enrolment;
    modalRef.componentInstance.data = { enrolment, isUnfreeze: true };
    modalRef.result
      .then((result) => {
        if (result) {
          console.log('result: ', result);
          this.enrollmentService.unFreeze(enrolment.enrolment.id, result, this.branch_id).subscribe(
            (res) => {
              alert('Unfreeze Successful');
              this.ngOnInit();
            },
            (err) => {
              console.log('err: ', err);
              alert(err.error.message);
            }
          );
        }
      })
      .catch((error) => {
        console.log('onUnfreeze, error: ', error);
      });
  }

  onChangeClass() {
    console.log('this.enrolment', this.enrolment);
    const modalRef = this.modalService.open(ChangeClassComponent);
    modalRef.componentInstance.data = { student: this.enrolment };
    modalRef.result.then((res) => {
      if (res.status === 'OK') {
        alert('Class changed successfully');
        this.ngOnInit();
      }
      console.log('details, res:', res);
    });
  }

  editExtend(lesson, i, j) {
    const themeLessonIndex = j === 0 ? i - 1 : i;
    const prevThemeLesson = this.latestThemeLessons[themeLessonIndex];

    const lessonIndex = j === 0 ? (prevThemeLesson.lessons.length - 1) : (j - 1);

    const prev_lesson = prevThemeLesson.lessons[lessonIndex];
  
    const modalRef = this.modalService.open(EditExtendComponent);

    modalRef.componentInstance.data = {
      enrolment_id: this.enrolment.enrolment.id,
      lesson,
      prev_lesson,
    };
    
    modalRef.result.then((res) => {
      if (res) {
        alert('Extension start date changed successfully');
        this.ngOnInit();
      }
    });
  }
}
