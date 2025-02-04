import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Grade} from '../../../model/grade';
import {Observable, Subscription} from 'rxjs';
import {ClassLessonDto} from '../../../model/class-lesson-dto';
import {DefaultBranchService} from '../../../default-branch.service';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {DataForSelect} from '../../../model/data-for-select';
import {CalendarService} from '../../../calendar/calendar.service';
import {EnrollmentListItem} from '../../../model/enrollment-list-item';
import * as moment from 'moment';

@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.css']
})
export class AdvanceComponent implements OnInit {

  @Input() data: {nextGrade: Grade, enrolment: EnrollmentListItem};
  advanceForm: FormGroup;
  isEarlyAdvance = false;
  submitted = false;
  branch_id: number;
  commencementDate$$: Subscription;
  slot$: Observable<DataForSelect[]>;
  last_lesson_date: string;

  constructor(
    private defaultBranchService: DefaultBranchService,
    public activeModal: NgbActiveModal,
    private calendarService: CalendarService,
  ) { }

  ngOnInit(): void {
    console.log('AdvanceComponent data: ', this.data);
    this.defaultBranchService.defaultBranch$
      .subscribe(branch_id => {
        if (branch_id) {
          this.branch_id = branch_id;
        }
      });
    this.initializeForm();
    this.listenToCommencementDate();
    this.last_lesson_date = moment(this.data.enrolment.class_lesson[this.data.enrolment.class_lesson.length - 1].start_datetime).format('YYYY-MM-DD');
  }

  initializeForm() {
    this.advanceForm = new FormGroup({
      'is_early_advance': new FormControl(false),
      'last_lesson_id': new FormControl(null),
      'commencement_date': new FormControl(''),
      'to_class_id': new FormControl(''),
      'remarks': new FormControl(''),
    })
  }

  listenToCommencementDate() {
    this.commencementDate$$ = this.advanceForm.get('commencement_date').valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(commencement_date => {
        console.log('commencement_date: ', this.convertDatePickerFormatForSubmit(commencement_date));
        if (this.advanceForm.get('commencement_date').valid) {
          if (this.data.nextGrade.category_id) {
            this.slot$ =
              this.calendarService.getAdvanceExtendClasses(
                this.data.enrolment.enrolment.id, this.convertDatePickerFormatForSubmit(commencement_date), this.data.nextGrade.id)
              .pipe(
                map(slots => slots.map(slot => {
                    return {
                      id: slot.id,
                      name:
                        slot.day + ' ' +
                        slot.start_time + ' - ' +
                        slot.end_time + ' (' +
                        slot.number_enrolled + '/' +
                        6 + ')',
                        // slot.max_class_size + ')',
                    }
                  })
                )
              )
          }
        }
      })
  }

  convertDatePickerFormatForSubmit(date: {year: number, month: number, day: number}) {
    // Converts {year: 2020, month: 10, day: 25} to 2020-10-25 for submit to server
    if (!date.year || !date.month || !date.day) {
        return null;
    }
    return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
  }

  advance() {
    this.advanceForm.get('is_early_advance').setValue(this.isEarlyAdvance);
    const body: any = this.advanceForm.value;
    body.commencement_date = this.convertDatePickerFormatForSubmit(body.commencement_date);
    console.log('this.advanceForm: ', this.advanceForm);
    console.log('body: ', body);
    this.activeModal.close(body);
  }

  onLastClassChange(classSlot) {
    this.advanceForm.get('last_lesson_id').setValue(classSlot);
  }

  isEarlyCheck(event) {
    console.log('isEarlyCheck: ', event.target.checked);
    this.isEarlyAdvance = event.target.checked;
    if (!event.target.checked) {
      this.advanceForm.get('last_lesson_id').setValue(null);
    }
  }
}
