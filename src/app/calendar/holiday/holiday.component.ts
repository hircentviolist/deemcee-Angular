import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { HolidayListItemDto } from 'app/model/holiday-list-item-dto';
import { Observable, Subscription } from 'rxjs';
import { HolidayGetDto } from 'app/model/holiday-get-dto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HolidayPostDto } from 'app/model/holiday-post-dto';
import { DataForSelect } from 'app/model/data-for-select';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/auth/auth.service';
import { take } from 'rxjs/operators';
import { DefaultBranchService } from 'app/default-branch.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.css']
})
export class HolidayComponent implements OnInit, OnDestroy {

  years: HolidayListItemDto[];
  holidays: HolidayGetDto;
  id: number = 0;
  branch_id: number;
  defaultBranch$$: Subscription;

  newCalendarYear: string; // eg if last year in list is 2022, newCalendarYear will be 2023

  state: {
    main: 'show' | 'add'; // Controls Form Submit
    status: 'Published' | 'Draft' | 'New' | 'None'; // Controls List Display and Buttons
    rows: {state: 'show' | 'update' | 'delete'}[]; // Controls List Rows
  }

  holidayForm: FormGroup;

  submitted = false;

  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;

  isAdmin: boolean;

  startDate: NgbDateStruct;
  endDate: NgbDateStruct;
  date: {year: number, month: number};

  branch$: Observable<DataForSelect[]>
  queryParam: {year_id: number, holiday_id: number, branch_id: number} = {
    year_id: null,
    holiday_id: null,
    branch_id: null,
  }

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private licenseeService: LicenseeService,
    private defaultBranchService: DefaultBranchService,
    private calendarService: CalendarService) {
      this.route.queryParams.subscribe(params => {
        if (params.year_id) {
          this.queryParam.year_id = params.year_id
        }
        if (params.holiday_id) {
          this.queryParam.holiday_id = params.holiday_id
        }
        if (params.branch_id) {
          this.queryParam.branch_id = params.branch_id
        }
      })
    }

  ngOnInit(): void {

    this.initializeForm();
    this.initializeState();
    this.branch$ = this.licenseeService.getBranchForSelect();
    this.checkIfAdmin();

    this.defaultBranch$$ =
    this.defaultBranchService.defaultBranch$
    .subscribe(branch_id => {
      if (branch_id) {
        this.branch_id = branch_id;
        this.getHolidays()
      }
    })

  }

  checkIfAdmin() {
    this.authService.credential$
    .pipe(take(1))
    .subscribe(cred => this.isAdmin = (cred.role === 'admin' || cred.role === 'superadmin'));
  }

  onChangeYear(e, callback = null) {
    if (e.target.value === '0') {
      return;
    }
    this.initializeState();
    this.id = +e.target.value;
    this.populateList(this.id, callback);
  }

  initializeState() {
    this.state = {
      main: 'show',
      status: this.holidays ? this.holidays.status : 'None',
      rows: []
    }

    console.log('this.holidays', this.holidays)
    console.log('state', this.state)

    if (!this.holidays) {
      return;
    }

    // Create New Calendar
    this.holidays.dates.forEach(el => {
      this.state.rows.push({state: 'show'})
    })
    this.submitted = false;
  }

  initializeForm() {
    this.holidayForm = new FormGroup({
      title: new FormControl('', Validators.required),
      start: new FormControl('', Validators.required),
      end: new FormControl('', Validators.required)
    })
  }

  populateSelectYear(e) {

    if (!e.target?.value) {
      return;
    }

    this.branch_id = e.target.value;

  }

  getHolidays() {
    console.log('getHolidays');
    this.calendarService.getAllHolidays(this.branch_id)
    .subscribe(data => {
      this.years = data;
      const d = new Date();
      this.newCalendarYear =
      this.years.length > 0 ?
      (+this.years[this.years.length - 1]['year'] + 1).toString() :
        '2018';
      // d.getFullYear().toString();
      this.minDate = {
        year: parseInt(this.newCalendarYear),
        month: 1,
        day: 1
      };
      this.maxDate = {
        year: parseInt(this.newCalendarYear),
        month: 12,
        day: 31
      };

      if (this.isAdmin && this.hasIds()) {
        if (+this.queryParam.branch_id !== this.branch_id) {
          this.defaultBranchService.defaultBranch$.next(+this.queryParam.branch_id);
          this.getHolidays();
          return;
        }
        this.onChangeYear({target: {value: this.queryParam.year_id}}, () => {
          const index = this.holidays.dates.findIndex(d => +d.id === +this.queryParam.holiday_id);
          
          if (index < 0) {
            this.location.back();
            return;
          }
          
          this.onChangeRows(index, 'update');
        })

        setTimeout(() => {
          this.id = this.queryParam.year_id;
        }, 1000)
      }
      console.log('getHolidays - ', data);
    });
  }

  hasIds(): boolean {
    if (this.queryParam.year_id && this.queryParam.holiday_id && this.queryParam.branch_id) {
      return true;
    }
    return false;
  }

  populateList(id: number, callback = null) {
    this.calendarService.getOneHoliday(id)
    .subscribe(
      data => {
        this.holidays = data;
        this.initializeState();
        this.minDate = {
          year: parseInt(data.year),
          month: 1,
          day: 1
        };
        this.maxDate = {
          year: parseInt(data.year),
          month: 12,
          day: 31
        };

        if (callback) {
          callback();
        }
      },
      err => {
        console.error(err);
        alert(`Unable to fetch Holiday. ${JSON.stringify(err.error)}`)
      }
    )
  }

  populateForm(i: number) {
    this.holidayForm.setValue({
      title: this.holidays.dates[i].title ? this.holidays.dates[i].title : 'some holiday',
      start: this.convertToDatePickerFormat(this.holidays.dates[i].start),
      end: this.convertToDatePickerFormat(this.holidays.dates[i].end),
    })
  }

  onPublish() {
    if (this.submitted) {
      return;
    }
    this.submitted = true;

    const id = this.holidays.id;
    const body: any = this.holidays;
    body.branch_id = this.holidays.branch.id
    body.status = 'Published';
    this.calendarService.updateHoliday(id, body)
    .subscribe(
      data => {
        this.id = +data['id'];
        this.populateSelectYear(this.branch_id);
        this.populateList(data['id']);
        this.initializeState();

        const selectedYear = this.years.find(year => +year.id === +this.id);

        if (selectedYear) {
          selectedYear.status = 'Published';
        }
        alert(`${data['year']} is successfully published`);
        console.log(`selectedYear = ${data['year']}`);
        this.ngOnInit();
      }
    )
    console.log(`selectedYear = ${this.years.find(year => +year.id === +this.id)}`);
  }

  onSubmit() {
    if (this.submitted) {
      return;
    }

    this.submitted = true;
    console.log('onSubmit: ', this.holidayForm);
    if (!this.holidayForm.valid) {
      this.submitted = false;
      return;
    }

    // alert(this.state.status)

    // Creating New Year
    if (this.state.status === 'New') {
      const body = {
        branch_id: this.branch_id,
        year: this.newCalendarYear,
        status: 'Draft',
        dates: []
      }
      console.log('onSubmit: ', body);
      body.dates.push({
        title: this.holidayForm.get('title').value,
        start: this.convertDatePickerFormatForSubmit(this.holidayForm.get('start').value),
        end: this.convertDatePickerFormatForSubmit(this.holidayForm.get('end').value)
      });
      this.calendarService.addCalendarYear(body)
      .subscribe(
        data => {
          console.log('data', data);

          this.years.push({
            id: data['id'],
            year: this.newCalendarYear,
            status: 'Draft'
          })

          this.holidayForm.reset();
          this.id = data['id'];
          this.initializeState();
          this.populateList(data['id']);
          this.onChangeStatus('Draft');
        }
      )
      return;
    }

    // Existing Calendar
    if (this.isUpdate()) {
      // update
      // get category id to update
      const categoryIndex = this.state.rows.map(r => r.state).indexOf('update');
      const body: any = this.holidays;
      body.branch_id = this.branch_id;
      body.dates[categoryIndex].title = this.holidayForm.value.title;
      body.dates[categoryIndex].start = this.convertDatePickerFormatForSubmit(this.holidayForm.value.start);
      body.dates[categoryIndex].end = this.convertDatePickerFormatForSubmit(this.holidayForm.value.end);
      this.calendarService.updateHoliday(this.id, body)
      .subscribe(
        () => {
          this.holidayForm.reset()
          this.populateList(this.id)
        },
        err => {
          console.error(err);
          alert(`Unable to update Holiday. ${JSON.stringify(err.error)}`)
        }
      )


    } else {
      // add new holiday
      const body: any = this.holidays;
      body.branch_id = this.branch_id;
      body.dates.push({
        title: this.holidayForm.value.title,
        start: this.convertDatePickerFormatForSubmit(this.holidayForm.value.start),
        end: this.convertDatePickerFormatForSubmit(this.holidayForm.value.end),
      })
      this.calendarService.addHoliday(this.id, body)
      .subscribe(
        () => {
          this.holidayForm.reset()
          this.populateList(this.id)
        },
        err => {
          console.error(err);
          alert(`Unable to add Holiday. ${JSON.stringify(err.error)}`)
        }
      )
    }


  }

  onSelectDate(date: 'start-date' | 'end-date', e: Event) {

    const start = this.holidayForm.get('start');
    const end = this.holidayForm.get('end');

    console.log(date, e)
    console.log(start.value.year)
    console.log(start.value.month)

    // if (!start.value || !end.value) {
    //   return
    // } else if (start.value.year > end.value.year) {
    //   this.alertDateProblem(date);
    // } else if (start.value.month > end.value.month) {
    //   this.alertDateProblem(date);
    // } else if (start.value.year === end.value.year && start.value.month > end.value.month && start.value.day > end.value.day) {
    //   this.alertDateProblem(date);
    // } else {
    //   alert ('unknown date type eg start or end');
    // }

  }

  private alertDateProblem(date: 'start-date' | 'end-date') {
    // alert('Start Date Is After End Date');
    // if (date === 'start-date') {
    //   this.holidayForm.get('start').reset()
    // } else if (date === 'end-date') {
    //   this.holidayForm.get('end').reset()
    // } else {
    //   console.log('unknown date type');
    // }
  }

  onDelete(holidayArray: number) {
    if (this.holidays.dates.length === 1) {
      return alert('Unable to delete holiday. Please leave at least one holiday.');
    }

    const body: any = this.holidays;
    body.dates.splice(holidayArray, 1);
    body.branch_id = this.holidays.branch.id

    this.calendarService.deleteHoliday(this.id, body)
    .subscribe(
      () => this.populateList(this.id),
      err => {
        console.error(err);
        alert(`Unable to delete category. ${JSON.stringify(err.error)}`)
      }
    )
  }

  onChangeMain(state: 'add' | 'show') {
    // reset all rows to show
    this.state.rows.map(r => r.state = 'show');
    this.state.main = state;
    this.holidayForm.reset();
  }

  onChangeRows(i: number, state: 'show' | 'update' | 'delete') {
    console.log(i, state);
    this.state.main = 'show';
    // reset all rows to show
    this.state.rows.map(r => r.state = 'show');
    // set row to state
    this.state.rows[i].state = state;
    if (state === 'update') {
      this.holidayForm.reset();
      this.populateForm(i);
      this.submitted = false;
    }

    if (state === 'delete') {
      this.onDelete(i);
    }
  }

  onChangeStatus(status: 'Published' | 'Draft' | 'New' | 'None') {
    console.log('onChangeStatus: ', status);
    this.state.status = status;

    let year = 0;

    switch (status) {
      case 'Published':
        const selectedYear = this.years.find(year => +year.id === +this.id);

        if (selectedYear) {
          selectedYear.status = 'Published';
        }
      break;

      case 'Draft':
        const selectedDraftYear = this.years.find(year => +year.id === +this.id);

        if (selectedDraftYear) {
          year = +selectedDraftYear.year;
        }
      break;

      case 'New':
        year = +this.newCalendarYear;
      break;

      case 'None':
        //
      break;
    }

    if (year) {
      this.minDate = {
        year,
        month: 1,
        day: 1
      };
      this.maxDate = {
        year,
        month: 12,
        day: 31
      };
    }
  }

  isUpdate(): boolean {
    if (!this.state) {
      return false;
    }
    return this.state.rows.filter(s => s.state === 'update').length > 0;
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

  convertDatePickerFormatForSubmit(date: {year: number, month: number, day: number}) {
    // Converts {year: 2020, month: 10, day: 25} to 2020-10-25 for submit to server
    return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
  }

  ngOnDestroy() {
    this.defaultBranch$$.unsubscribe();
  }


}

