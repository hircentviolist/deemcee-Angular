import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Calendar } from 'app/model/calendar';
import { HolidayListItemDto } from 'app/model/holiday-list-item-dto';
import { HolidayGetDto } from 'app/model/holiday-get-dto';
import { HolidayPostDto } from 'app/model/holiday-post-dto';
import { EventListItemDTO } from 'app/model/event-list-item-dto';
import { EventGetDto } from 'app/model/event-get-dto';
import { ClassListItemDto } from 'app/model/class-list-item-dto';
import { ClassGetDto } from 'app/model/class-get-dto';
import { map } from 'rxjs/operators';
import { DataForSelect } from 'app/model/data-for-select';
import { Observable } from 'rxjs';
import {ClassSessionDto} from '../model/class-session-dto';
import {ClassRecordDto} from '../model/class-record-dto';
import { Moment } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  branch$: Observable<DataForSelect[]>;

  constructor(private http: HttpClient) { }

  getCalendar(branch_id: number, month = null, year = null) {
    let queryParams = `?branch_id=${branch_id}`;
    queryParams += month && year ? `&month=${month}&year=${year}` : '';

    const url = environment.backendApi + 'calendar' + queryParams;
    return this.http.get<Calendar[]>(url)
            .pipe(
              map(cal => cal.map(c => {
                const body: any = c;
                body.editable = false;
                return body;
              }))
            )
  }

  getAllHolidays(id: number) {
    const url = environment.backendApi + 'calendar/holidays?branch_id=' + id.toString();
    return this.http.get<HolidayListItemDto[]>(url);
  }

  getOneHoliday(id: number) {
    const url = environment.backendApi + 'calendar/holidays/' + id.toString();
    return this.http.get<HolidayGetDto>(url);
  }

  updateHoliday(id: number, holiday) {
    console.log(holiday);
    const url = environment.backendApi + 'calendar/holidays/' + id.toString();
    return this.http.put(url, holiday);
  }

  addHoliday(id: number, holiday) {
    // Add one holiday to Holiday Year
    console.log(holiday);
    const url = environment.backendApi + 'calendar/holidays/' + id.toString();
    return this.http.put(url, holiday);
  }

  addCalendarYear(body) {
    const url = environment.backendApi + 'calendar/holidays';
    console.log(body);
    console.log(url);
    return this.http.post(url, body);
  }

  deleteHoliday(id: number, holiday) {
    const url = environment.backendApi + 'calendar/holidays/' + id.toString();
    return this.http.put(url, holiday);
  }

  getAllEvents(branch_id: number) {
    const url = environment.backendApi + 'calendar/events?branch_id=' + branch_id;
    return this.http.get<EventListItemDTO[]>(url);
  }

  getOneEvent(id: number) {
    const url = environment.backendApi + 'calendar/events/' + id.toString();
    return this.http.get<EventGetDto>(url);

  }

  addEvent(event) {
    const url = environment.backendApi + 'calendar/events';
    return this.http.post(url, event);
  }

  updateEvent(id: number, event) {
    const url = environment.backendApi + 'calendar/events/' + id.toString();
    return this.http.put(url, event);

  }

  approvePublishEvent(id: number) {
    const url = environment.backendApi + 'calendar/events/' + id.toString() + '/approve';
    return this.http.put(url, {});
  }

  deleteEvent(id: number) {
    const url = environment.backendApi + 'calendar/events/' + id.toString();
    return this.http.delete(url);
  }

  getAllClasses(branch_id: number, start_date: Moment = null, end_date: Moment = null) {
    let params = new HttpParams().set('branch_id', String(branch_id));

    if (start_date && end_date) {
      params = params.append('start_date', start_date.format('YYYY-MM-DD'));
      params = params.append('end_date', end_date.format('YYYY-MM-DD'));
    }

    const url = environment.backendApi + 'calendar/classes';
    return this.http.get<ClassListItemDto[]>(url, {params});
  }

  getSuitableClasses(branch_id: number, commencement_date: string, grade_id: number) {
    const url = environment.backendApi + 'calendar/available-classes';
    const params = new HttpParams()
        .set('branch_id', String(branch_id))
        .set('commencement_date', commencement_date)
        .set('grade_id', String(grade_id));
    return this.http.get<ClassListItemDto[]>(url, {params: params});
  }

  getAdvanceExtendClasses(enrolment_id: number, commencement_date: string, grade_id: number) {
    const url = `${environment.backendApi}calendar/advance-extend/${enrolment_id}`;
    const params = new HttpParams()
        .set('commencement_date', commencement_date)
        .set('grade_id', String(grade_id));
    return this.http.get<ClassListItemDto[]>(url, {params});
  }

  getRescheduleDate(branch_id: number, lesson_id: number) {
    const url = environment.backendApi + 'calendar/lessons';
    const params = new HttpParams()
      .set('branch_id', String(branch_id))
      .set('program_theme_lessons', String(lesson_id));
    return this.http.get<ClassSessionDto[]>(url, {params: params});
  }

  getOneClass(id: number, { per_page, page }: { per_page: number, page: number } ) {
    const params = new HttpParams()
      .set('page', page + '')
      .set('per_page', per_page + '');
    const url = environment.backendApi + 'calendar/classes/' + id.toString();
    return this.http.get<ClassGetDto>(url, {params});

  }

  addClass(classes) {
    const url = environment.backendApi + 'calendar/classes';
    return this.http.post(url, classes);
  }

  updateClass(id: number, classes) {
    const url = environment.backendApi + 'calendar/classes/' + id.toString();
    return this.http.put(url, classes);

  }

  deleteClass(id: number) {
    const url = environment.backendApi + 'calendar/classes/' + id.toString();
    return this.http.delete(url);
  }

  getClassLesson(class_lesson_id, branch_id: number = null) {
    let headers = new HttpHeaders();

    if (branch_id) {
      headers = headers.set('Branch-Id', String(branch_id));
    }

    const url = environment.backendApi + 'calendar/class_lessons/' + class_lesson_id.toString();
    return this.http.get<ClassRecordDto>(url, {headers});
  }

  getTeacherManager(branch_id: number) {
    const url = environment.backendApi + 'calendar/class_lessons/teacher_manager?branch_id=' + branch_id.toString();
    return this.http.get<any>(url);
  }

  updateClassLesson(class_lesson_id, branch_id, body) {
    console.log('updateClassLesson: ', body);
    const url = environment.backendApi + 'calendar/class_lessons/' + class_lesson_id.toString();
    return this.http.put(url, body);
  }

  startClassLesson(class_lesson_id, branch_id, body) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'calendar/class_lessons/' + class_lesson_id.toString();
    return this.http.post(url, body, {headers});
  }
}
