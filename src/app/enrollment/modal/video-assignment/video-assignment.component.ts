import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Grade} from '../../../model/grade';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StructureService} from '../../../structure/structure.service';
import {Observable} from 'rxjs';
import {CategoryDetail} from '../../../model/category-detail.dto';
import {LessonThemeListItemDto} from '../../../model/lesson-theme-list-item-dto';

@Component({
  selector: 'app-video-assignment',
  templateUrl: './video-assignment.component.html',
  styleUrls: ['./video-assignment.component.css']
})
export class VideoAssignmentComponent implements OnInit {

  @Input() data: {
    id: number,
    video_number: number, 
    enrolment_id: number, 
    student_id: number, 
    student_name: string, 
    category_id: number,
    theme_id: number,
    submission_date: string,
    video_url: string,
  };
  videoForm: FormGroup;
  categoryDetail$: Observable<LessonThemeListItemDto[]>;
  themeList: LessonThemeListItemDto[] = [];
  submitted = false;
  constructor(public activeModal: NgbActiveModal, private structureService: StructureService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getThemes();
  }

  initializeForm() {
    this.videoForm = new FormGroup({
      'id': new FormControl(this.data.id),
      'student_id': new FormControl(this.data.student_id, Validators.required),
      'enrolment_id': new FormControl(this.data.enrolment_id, Validators.required),
      'video_number': new FormControl(this.data.video_number, Validators.required),
      'theme_id': new FormControl(this.data.theme_id ? this.data.theme_id : '', Validators.required),
      'submission_date': new FormControl(this.data.submission_date ? this.convertToDatePickerFormat(this.data.submission_date) : '', Validators.required),
      'video_url': new FormControl(this.data.video_url ? this.data.video_url : '', Validators.required),
    });
  }

  getThemes() {
    this.categoryDetail$ = this.structureService.getAllLessonTheme();
    this.categoryDetail$.subscribe(resp => {
      resp.map(theme => {
        if (theme.category.id === this.data.category_id) {
          this.themeList.push(theme);
        }
      })
    })
  }

  submitAssignment() {
    const body: any = this.videoForm.value;
    body.submission_date = this.convertDatePickerFormatForSubmit(body.submission_date);
    this.activeModal.close(body);
  }

  convertDatePickerFormatForSubmit(date: {year: number, month: number, day: number}) {
    // Converts {year: 2020, month: 10, day: 25} to 2020-10-25 for submit to server
    return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
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

  onThemeChange(theme_id) {
  }
}
