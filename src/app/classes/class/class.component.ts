import { Component, OnInit } from '@angular/core';
import { ClassListItemDto } from 'app/model/class-list-item-dto';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DataForSelect } from 'app/model/data-for-select';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { StructureService } from 'app/structure/structure.service';
import { DAYS } from 'app/resource/days';
import { map, tap, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { NgbDateStruct, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { DefaultBranchService } from 'app/default-branch.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CalendarService } from 'app/calendar/calendar.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {

  classes: ClassListItemDto[];
  branch_id: number;
  branch$: Observable<DataForSelect[]>;
  defaultBranch$$: Subscription;

  classForm: FormGroup;
  active: number;

  constructor(
    private licenseeService: LicenseeService,
    private defaultBranchService: DefaultBranchService,
    private calendarService: CalendarService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
		this.route.queryParams.subscribe(params => {
			if (params.active) {
				this.active = isNaN(params.active) ? 4 : Number(params.active);
			}
    })
    this.removeUnnecessaryQueryParams(4);
  }

  ngOnInit(): void {
    this.branch$ = this.branch$ = this.licenseeService.getBranchForSelect();
    this.defaultBranch$$ = this.defaultBranchService.defaultBranch$
      .subscribe(branch_id => {
        if (branch_id) {
          this.branch_id = branch_id;
          this.populateList();
        }
      });
  }

  removeUnnecessaryQueryParams(pageIndex) {
		this.route.queryParams.subscribe(params => {
      if (+params.active === pageIndex) {
        this.router.navigate([], {
          queryParams: {
            active: params.active,
            year_id: null,
            holiday_id: null,
            branch_id: null,
          },
          queryParamsHandling: 'merge',
        });
      }
    })
  }

  addParents() {
    const addParent = this.classForm.get('parents') as FormArray;
    addParent.push(new FormControl(''));
  }

  populateList() {
    this.calendarService.getAllClasses(this.branch_id)
    .subscribe(
      data => {
        this.classes = data;
        this.classes.map(classItem => {
          classItem.start_time = (classItem.start_time).substr(0, 5);
          classItem.end_time = (classItem.end_time).substr(0, 5);
        });
      },
      error => {
        console.error(error);
        alert(`Unable to fetch event. ${JSON.stringify(error.error)}`)
      }
    )
  }

  onDelete(id: number) {
    this.calendarService.deleteClass(id)
    .subscribe(
      () => this.populateList(),
      (err:HttpErrorResponse) => {
        console.error(err.error);
        alert(err.error.message)
      }
    )
  }

  ngOnDestroy(): void {
    this.defaultBranch$$.unsubscribe();
  }
}
