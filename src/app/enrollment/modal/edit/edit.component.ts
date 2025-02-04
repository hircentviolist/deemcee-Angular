import {Component, Input, OnInit} from '@angular/core';
import {EnrollmentListItem} from '../../../model/enrollment-list-item';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EnrollmentService} from '../../../enrollment.service';
import {StructureService} from '../../../structure/structure.service';
import {CalendarService} from '../../../calendar/calendar.service';
import {Observable, Subscription} from 'rxjs';
import {DefaultBranchService} from '../../../default-branch.service';
import {DataForSelect} from '../../../model/data-for-select';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {Grade} from '../../../model/grade';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  @Input() data: {student: EnrollmentListItem, mode: string};
  defaultBranch$$: Subscription;
  startDate$$: Subscription;
  grade$: Observable<Grade[]>;
  classes$: Observable<DataForSelect[]>;
  editForm: FormGroup;
  submitted = false;
  referralChannels: {id: number, name: string} [] = [];
  grades: {id: number, name: string} [] = [];
  branch_id: number;
  selected_category_id: number;

  constructor(
    public activeModal: NgbActiveModal,
    private defaultBranchService: DefaultBranchService,
    private enrollmentService: EnrollmentService,
    private structureService: StructureService,
    private calendarService: CalendarService,
  ) { }

  ngOnInit(): void {
    this.defaultBranch$$ =
      this.defaultBranchService.defaultBranch$
        .subscribe(branch_id => {
          if (branch_id) {
            this.branch_id = branch_id;
          }
        });
    this.initializeForm();
    this.getReferralChannels();
    this.getGradeList();
    this.getAvailableClasses(this.data.student.commencement_date);
    if (this.data.mode !== 'student') {
      this.listenToCommencementDate();
    }
    this.selected_category_id = this.data.student.grade.category_id;
  }

  initializeForm() {
    if (this.data.mode === 'student') {
      this.editForm = new FormGroup({
        'first_name': new FormControl('', Validators.required),
        'last_name': new FormControl(''),
        'gender': new FormControl('', Validators.required),
        'dob': new FormControl('', Validators.required),
        'school': new FormControl('', Validators.required),
        'referral_channel_id': new FormControl(0),
        'referral': new FormControl('')
      });
      this.editForm.patchValue({
        first_name: this.data.student.first_name + this.data.student.last_name,
        last_name: '',
        gender: this.data.student.gender,
        dob: this.convertToDatePickerFormat(this.data.student.dob),
        school: this.data.student.school,
        referral_channel_id: this.data.student.referral_channel?.id,
        referral: this.data.student.referral,
      })
    } else {
      this.editForm = new FormGroup({
        'grade_id': new FormControl(0, Validators.required),
        'start_date': new FormControl('', Validators.required),
        'class_id': new FormControl(0, Validators.required),
      });
      this.editForm.patchValue({
        grade_id: this.data.student.grade_id,
        start_date: this.convertToDatePickerFormat(this.data.student.commencement_date),
        class_id: this.data.student.enrolment.class_id,
      })
    }
  }

  getReferralChannels() {
    this.enrollmentService.getReferralChannelList().subscribe(res => {
      this.referralChannels = res;
    }, err => {
      console.log({err})
    })
  }

  getGradeList() {
    this.grade$ = this.structureService.getAllGrades();
    this.grade$.subscribe(res => {
      this.grades = res;
    }, err => {
      console.log({err})
    })
  }

  getAvailableClasses(commencement_date) {
    this.classes$ = this.calendarService
      .getSuitableClasses(
        this.branch_id,
        commencement_date,
        this.data.student.grade_id
      ).pipe(
        map(slots => this.addCurrentClass(slots.map(this.mapClassIdAndName)))
    )
  };

  mapClassIdAndName(deClass) {
    return {
      id: deClass.id,
      name: deClass.label + ' (' +
        (deClass.total_enrolled || deClass.number_enrolled) + '/' +
        6 + ')',
        // (deClass.max_slot || deClass.max_class_size) + ')',
    }
  }

  addCurrentClass(mappedSlots) {
    const {class: currentClass} = this.data.student.enrolment;

    const currentClassExists = mappedSlots.find(deClass => {
      return deClass.id === currentClass.id;
    });

    if (this.selected_category_id === currentClass.category_id && !currentClassExists) {
      mappedSlots.unshift(this.mapClassIdAndName(currentClass))
    }

    return mappedSlots;
  }

  convertDatePickerFormatForSubmit(date: {year: number, month: number, day: number}) {
    // Converts {year: 2020, month: 10, day: 25} to 2020-10-25 for submit to server
    if (date) {
      return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
    } else {
      return '';
    }
  }

  convertToDatePickerFormat(date: string) {
    // Converts 2020-10-25 to {year: 2020, month: 10, day: 25} for datepicker use

    if (date && date !== '') {
      const dateArray = date.split('-');
      return {
        year: +dateArray[0],
        month: +dateArray[1],
        day: +dateArray[2],
      }
    } else {
      return null;
    }
  }

  listenToCommencementDate() {
    this.startDate$$ = this.editForm.get('start_date').valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(start_date => {
        if (this.editForm.get('start_date').valid) {
          if (this.selected_category_id) {
            this.classes$ =
              this.calendarService.getSuitableClasses(
                this.branch_id, this.convertDatePickerFormatForSubmit(start_date), this.editForm.get('grade_id').value)
                .pipe(
                  map(slots => this.addCurrentClass(slots.map(this.mapClassIdAndName)))
                )
          }
        }
      })
  }

  onGradeChanged(grade_id) {
    this.grade$.subscribe(grades => {
      grades.map(grade => {
        if (String(grade.id) === grade_id) {
          this.selected_category_id = grade.category_id;
        }
      })
    });
    if (this.editForm.get('start_date').valid) {
      this.classes$ = this.calendarService
        .getSuitableClasses(
          this.branch_id,
          this.convertDatePickerFormatForSubmit(this.editForm.get('start_date').value),
          grade_id)
        .pipe(
          map(slots => this.addCurrentClass(slots.map(this.mapClassIdAndName)))
        )
    }
  }

  onSubmit() {
    const body = this.editForm.value;
    if (this.data.mode === 'student') {
      body.dob = this.convertDatePickerFormatForSubmit(body.dob);
    } else {
      body.start_date = this.convertDatePickerFormatForSubmit(body.start_date);
    }
    this.activeModal.close(body);
  }
}
