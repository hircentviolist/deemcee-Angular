import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import { CalendarService } from 'app/calendar/calendar.service';
import { ClassRecordDto } from 'app/model/class-record-dto';

@Component({
  selector: 'app-class-lesson-modal',
  templateUrl: './class-lesson-modal.component.html',
  styleUrls: ['./class-lesson-modal.component.css']
})
export class ClassLessonModalComponent implements OnInit {

  @Input() data: {id: number, branch_id: number, lesson: any};
  recordForm: FormGroup;
  submitted = false;
  attendedCount = 0;
  classRecord: ClassRecordDto;
  teacherManager$: Observable<any>;
  constructor(
    public activeModal: NgbActiveModal, private calendarService: CalendarService) { }

  ngOnInit(): void {
    console.log('lesson: ', this.data.lesson);
    this.initializeForm();
    this.getClassLesson();
    this.getTeacherManager();
  }

  get studentsFormArray() {
    return this.recordForm.controls.student as FormArray;
  }

  initializeForm() {
    this.recordForm = new FormGroup({
      teacher_id: new FormControl('', Validators.required),
      co_teacher_id: new FormControl(''),
      student: new FormArray([]),
      student_ids: new FormArray([]),
    });
  }

  getClassLesson() {
    this.calendarService.getClassLesson(this.data.id, this.data.branch_id).subscribe(
      res => {
        this.classRecord = res;
        console.log('res - ', res);
        if (res.actual_start_datetime != null) {
          this.recordForm.patchValue({
            teacher_id: res?.teacher?.id ?? 0,
            co_teacher_id: res?.co_teacher?.id ?? 0,
          })
        }
        this.addStudentList();
      }
    )
  }

  addStudentList() {
    this.classRecord.students.forEach(student => {
      if (student.has_attended) {
        this.studentsFormArray.push(new FormControl(true));
        this.attendedCount++;
      } else {
        this.studentsFormArray.push(new FormControl(false));
      }
    });
    console.log('this.studentsFormArray: ', this.studentsFormArray)
  }

  getTeacherManager() {
    this.teacherManager$ = this.calendarService.getTeacherManager(this.data.branch_id);
    this.teacherManager$.subscribe(
      res => {
        console.log('getTeacherManager: ', res)
      }
    )
  }

  onSubmit() {
    const selectedStudents = this.recordForm.value.student
      .map((checked, i) => checked ? this.classRecord.students[i] : null)
      .filter(v => v !== null);
    const selectedStudentIds = [];
    selectedStudents.map(student => {
      selectedStudentIds.push(student.id);
    });
    this.recordForm.value.student_ids = selectedStudentIds;
    if (this.recordForm.valid) {
      if (selectedStudentIds.length > 0) {
        this.activeModal.close(this.recordForm.value)
      } else {
        alert('Please select at least one student');
        this.submitted = true;
      }
    } else {
      console.log('Missing Field: ', this.recordForm);
      alert('Missing Field');
      this.submitted = true;
    }
  }

  capitalise(string) {
    if (string && string !== '') {
      const splitStr = string.toLowerCase().split(' ');

      for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] =
          splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
      }

      return splitStr.join(' ');
    }
  }
}
