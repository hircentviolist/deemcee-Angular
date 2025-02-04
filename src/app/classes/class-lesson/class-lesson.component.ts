import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import { ClassRecordDto } from 'app/model/class-record-dto';
import { CalendarService } from 'app/calendar/calendar.service';

@Component({
  selector: 'app-class-lesson',
  templateUrl: './class-lesson.component.html',
  styleUrls: ['./class-lesson.component.css']
})
export class ClassLessonComponent implements OnInit {

  id: number;
  classRecord: ClassRecordDto;

  constructor(
    public location: Location,
    private calendarService: CalendarService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params.id;
    console.log('this.route.snapshot.params.id: ', this.route.snapshot.params.id);
    this.getClassLesson();
  }

  getClassLesson() {
    this.calendarService.getClassLesson(this.id).subscribe(
      res => {
        this.classRecord = res;
        console.log('res - ', res);
      }
    )
  }

}
