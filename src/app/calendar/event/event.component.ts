import { Component, OnInit } from '@angular/core';
import { EventListItemDTO } from 'app/model/event-list-item-dto';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CalendarService } from '../calendar.service';
import { DataForSelect } from 'app/model/data-for-select';
import { Observable, Subscription } from 'rxjs';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { UserService } from 'app/user/user.service';
import {NgbDateStruct, NgbCalendar, NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { take, tap } from 'rxjs/operators';
import { DefaultBranchService } from 'app/default-branch.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/auth/auth.service';
import { Credentials } from 'app/model/credentials';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  events: EventListItemDTO[];
  branch_id: number;
  branch$: Observable<DataForSelect[]>;
  defaultBranch$$: Subscription;
  showAddBtn = false;
  cred: Credentials;
  active: number;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private licenseeService: LicenseeService,
    private defaultBranchService: DefaultBranchService,
    private calendarService: CalendarService) {
    this.route.queryParams.subscribe(params => {
      if (params.active) {
        this.active = isNaN(params.active) ? 3 : Number(params.active);
      }
    });
      this.removeUnnecessaryQueryParams(3);

      this.authService.credential$
      .pipe(
        take(1)
      ).subscribe(cred => this.cred = cred)
    }

  ngOnInit(): void {
    this.branch$ = this.branch$ = this.licenseeService.getBranchForSelect();
    this.defaultBranch$$ = this.defaultBranchService.defaultBranch$
      .subscribe(branch_id => {
        if (branch_id) {
          this.branch_id = branch_id;

          if (['superadmin',  'admin'].includes(this.cred.role) && +branch_id !== 1) {
            this.showAddBtn = false;
          } else {
            this.showAddBtn = true;
          }

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

  populateList() {
    this.calendarService.getAllEvents(this.branch_id)
    .subscribe(
      data => {
        this.events = data;
      },
      error => {
        console.error(error);
        alert(`Unable to fetch event. ${JSON.stringify(error.error)}`)
      }
    )
  }

  onDelete(id: number) {
    this.calendarService.deleteEvent(id)
    .subscribe(
      () => this.populateList(),
      err => {
        console.error(err);
        alert(`Unable to delete event. ${JSON.stringify(err.error)}`)
      }
    )
  }

  approve(event) {
    console.log({event})

		Swal.fire({
			icon: 'question',
			title: 'Approve & Publish',
			text: 'Are you sure you want to approve and publish this event?',
			showCloseButton: true,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: 'white',
			cancelButtonText: '<span style="color:grey">Cancel<span>',
			confirmButtonText: 'Yes',
		}).then(result => {
			if (result.value) {
        this.calendarService.approvePublishEvent(+event.id).subscribe(() => {
          this.populateList();
          Swal.fire(
            'Event published!',
            'Email has been sent to notify branches and invitees',
            'success'
          )
        }, err => {
          console.error(err);
          alert(`Unable to approve and publish event. ${JSON.stringify(err.error)}`)
        })

			}
		  Swal.showLoading()
    })
  }

  ngOnDestroy(): void {
    this.defaultBranch$$.unsubscribe();
  }
}
