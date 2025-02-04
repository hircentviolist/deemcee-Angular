import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {EnrollmentService} from '../../../enrollment.service';
import {ClassLessonDto} from '../../../model/class-lesson-dto';
import {ClassSessionDto} from '../../../model/class-session-dto';
import {CalendarService} from '../../../calendar/calendar.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DefaultBranchService} from '../../../default-branch.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reschedule',
  templateUrl: './reschedule.component.html',
  styleUrls: ['./reschedule.component.css']
})
export class RescheduleComponent implements OnInit {

  @Input() data: {enrolment: any};
  rescheduleForm: FormGroup;
  program_theme_name: string;
  lesson_name: string;
  mappedLessons = [];
  session$: Observable<ClassSessionDto[]>;
  branch_id: number;
  from_class_id: number;

  constructor(
      public activeModal: NgbActiveModal,
      private defaultBranchService: DefaultBranchService,
      private calendarService: CalendarService,
      private enrollmentService: EnrollmentService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.defaultBranchService.defaultBranch$
      .subscribe(branch_id => {
        if (branch_id) {
          this.branch_id = branch_id;
        }
      });
    console.log('RescheduleComponent, data: ', this.data.enrolment);
    this.program_theme_name = this.data.enrolment.class_lesson[0].theme_name;
    this.lesson_name = this.data.enrolment.class_lesson[0].display_name;
    console.log('program_theme_name: ', this.program_theme_name);
    console.log('lesson_name: ', this.lesson_name);
    this.data.enrolment.class_lesson.map(classLesson => {
      this.mappedLessons[String(classLesson.class_lesson_id)] = classLesson;
      console.log('this.mappedLessons: ', this.mappedLessons);
    });
  }

  initializeForm() {
    this.rescheduleForm = new FormGroup({
      'program_theme': new FormControl(''),
      'lesson_name': new FormControl(''),
      'from_class_lesson_id': new FormControl(''),
      'to_class_lesson_id': new FormControl(''),
    })
  }

  onFromClassChange(classSlot) {
    console.log('onFromClassChange, classSlot: ', classSlot);
    console.log('this.mappedLessons[classSlot].theme_lesson_id: ', this.mappedLessons[classSlot].theme_lesson_id);
    this.from_class_id = classSlot;
    this.program_theme_name = this.mappedLessons[classSlot].theme_name;
    this.lesson_name = this.mappedLessons[classSlot].display_name;
    this.session$ = this.calendarService.getRescheduleDate(this.branch_id, this.mappedLessons[classSlot].theme_lesson_id)
      .pipe(
        map(sessions => {
          console.log('sessions: ', sessions);
          const filteredSessions = [];
          sessions.map(session => {
            session.de_class.start_time = moment(session.de_class.start_time).format('HH:mm:ss');
            session.de_class.end_time = moment(session.de_class.end_time).format('HH:mm:ss');
            if (String(session.id) !== classSlot) {
              filteredSessions.push(session);
            }
            return session;
            });
          return filteredSessions;
        })
      )
  }

  onToClassChange(classSlot) {
    console.log('onToClassChange, classSlot: ', classSlot);
    this.rescheduleForm.get('to_class_lesson_id').setValue(classSlot);
  }

  reschedule() {
    const body = {
      from_class_lesson_id: parseInt(String(this.from_class_id)),
      to_class_lesson_id: parseInt(this.rescheduleForm.get('to_class_lesson_id').value)
    };
    console.log('reschedule, body: ', body);
    this.activeModal.close(body);
  }

  capitalise(string) {
    const splitStr = string.toLowerCase().split(' ');

    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(' ');
  }
}
