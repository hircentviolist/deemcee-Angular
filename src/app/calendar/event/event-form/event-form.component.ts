import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbCalendar, NgbTimepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { UserService } from 'app/user/user.service';
import { CalendarService } from 'app/calendar/calendar.service';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { DataForSelect } from 'app/model/data-for-select';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { tap, take } from 'rxjs/operators';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { MediaService } from 'app/media.service';
import { AuthService } from 'app/auth/auth.service';
import { Credentials } from 'app/model/credentials';
import { DefaultBranchService } from 'app/default-branch.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit, OnDestroy {

  eventForm: FormGroup;
  branch$: Observable<DataForSelect[]>;
  submitted = false;
  id: string;
  cred: Credentials;
  branch_id: number;

  // Datepicker
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;
  date: {year: number, month: number};

  // Timepicker
  start_time: {hour: 8, minute: 30};
  end_time: {hour: 9, minute: 30};

  // Branch Multi Select Dropdown
  branchDropdownList: {branch_id: number, branch_text: string}[] = [];
  branchSelectedItems: {branch_id: number, branch_text: string}[] = [];
  branchDropdownSettings: IDropdownSettings;
  branches: {branch_id: number}[] = [];

  // Parent Multi Select Dropdown
  parentDropdownList: {user_id: number, user_text: string}[] = [];
  parentSelectedItems: {user_id: number, user_text: string}[] = [];
  parentDropdownSettings: IDropdownSettings;
  parents: {user_id: number}[] = [];

  // Managers Multi Select Dropdown
  managersDropdownList: {user_id: number, user_text: string}[] = [];
  managersSelectedItems: {user_id: number, user_text: string}[] = [];
  managersDropdownSettings: IDropdownSettings;
  managers: {user_id: number}[] = [];

  // Teachers Multi Select Dropdown
  teachersDropdownList: {user_id: number, user_text: string}[] = [];
  teachersSelectedItems: {user_id: number, user_text: string}[] = [];
  teachersDropdownSettings: IDropdownSettings;
  teachers: {user_id: number}[] = [];

  // Principals Multi Select Dropdown
  principalsDropdownList: {user_id: number, user_text: string}[] = [];
  principalsSelectedItems: {user_id: number, user_text: string}[] = [];
  principalsDropdownSettings: IDropdownSettings;
  principals: {user_id: number}[] = [];

  branch$$: Subscription;
  event: any;

  active: number;

  constructor(
    private calendar: NgbCalendar,
    private licenseeService: LicenseeService,
    private config: NgbTimepickerConfig,
    private route: ActivatedRoute,
    private userService: UserService,
    private calendarService: CalendarService,
    private mediaService: MediaService,
    private router: Router,
    private authService: AuthService,
    private defaultBranch: DefaultBranchService
  ) {
    // time spinner
    config.seconds = false;
    config.spinners = false;
    config.minuteStep = 15;
    config.size = 'medium';

    // get id
    this.id = route.snapshot.paramMap.get('id');

    this.route.queryParams.subscribe(params => {
      if (params.active) {
        this.active = isNaN(params.active) ? 3 : Number(params.active);
      }
    });

    authService.credential$
    .pipe(
      take(1)
    ).subscribe(cred => this.cred = cred)

  }

  ngOnInit(): void {
    this.branch$ = this.branch$ = this.licenseeService.getBranchForSelect();
    this.initializeForm();
    this.initializeMultiSelect();
    if (this.id !== 'new') {
      this.populateForm();
    }

    this.branch$$ =
    this.defaultBranch.defaultBranch$
    .subscribe(
      branch_id => this.branch_id = branch_id
    )

    // Populate Branch
    this.licenseeService.getPublicBranchForSelect()
    .subscribe(
      data => {
        this.branchDropdownList = data.map(d => {
          return {
            branch_id: d.id,
            branch_text: d.name
          }
        })
      },
      error => {
        console.error(error),
        alert(`Unable to get branch list. ${JSON.stringify(error.error)}`)
      }
    )
  }


  initializeForm() {
    this.eventForm = new FormGroup({
      branch_id: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      start_date: new FormControl('', Validators.required),
      start_time: new FormControl('', Validators.required),
      end_date: new FormControl('', Validators.required),
      end_time: new FormControl('', Validators.required),
      venue: new FormControl('', Validators.required),
      maximum_pax: new FormControl('',  Validators.required),
      status: new FormControl('Pending Review', Validators.required),
      points_reward: new FormControl(0),
      image_url: new FormControl(''),
      branches: new FormControl(),
      parents: new FormControl(),
      teachers: new FormControl(),
      managers: new FormControl(),
      principals: new FormControl(),
      invite_hq: new FormControl(),
    })
  }

  initializeMultiSelect() {
    // Settings for Branch Dropdown
    this.branchDropdownSettings = {
      singleSelection: false,
      idField: 'branch_id',
      textField: 'branch_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    }

    // Settings for Parent Dropdown
    this.parentDropdownSettings = {
      singleSelection: false,
      idField: 'user_id',
      textField: 'user_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    }

    // Settings for Principal Dropdown
    this.principalsDropdownSettings = {
      singleSelection: false,
      idField: 'user_id',
      textField: 'user_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    }

    // Settings for Manager Dropdown
    this.managersDropdownSettings = {
      singleSelection: false,
      idField: 'user_id',
      textField: 'user_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    }

    // Settings for Teacher Dropdown
    this.teachersDropdownSettings = {
      singleSelection: false,
      idField: 'user_id',
      textField: 'user_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    }
  }

  getTodayDate() {
    // returns date in YYYY-MM-dd
    let today: any = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
  }

  populateForm() {
    this.calendarService.getOneEvent(+this.id)
    .subscribe(data => {
      this.event = data;
      // map parents array
      this.parents = data.invites.parents ? data.invites.parents.map(p => {
        return {
          user_id: p?.user?.id,
          user_text: p?.user?.full_name
        }
      }) : [];

      // map managers array
      this.managers = data.invites.managers ? data.invites.managers.map(p => {
        return {
          user_id: p?.user?.id,
          user_text: p?.user?.full_name
        }
      }) : [];

      // map teachers array
      this.teachers = data.invites.teachers ? data.invites.teachers.map(p => {
        return {
          user_id: p?.user?.id,
          user_text: p?.user?.full_name
        }
      }) : [];

      // map principals array
      this.principals = data.invites.principals ? data.invites.principals.map(p => {
        return {
          user_id: p?.user?.id,
          user_text: p?.user?.full_name
        }
      }) : [];

      // map branches missing
      this.branches = data.invites.branches ? data.invites.branches.map(p => {
        return {
          branch_id: p?.branch?.id,
          branch_text: p?.branch?.name
        }
      }) : [];

      this.eventForm.patchValue({branches: this.branches});
      // get all users (parent/principal/manager/teacher) before patching form
      this.getAllUsers().then(res => {
        // populate form for selected event
        this.eventForm.patchValue({
          branch_id: data.branch ? data.branch.id : this.branch_id, // If no branch_id assign to HQ
          title: data.title,
          description: data.description,
          start_date: this.convertToDatePickerFormat(data.start.date),
          start_time: this.convertToTimePickerFormat(data.start.time),
          end_date: this.convertToDatePickerFormat(data.end.date),
          end_time: this.convertToTimePickerFormat(data.end.time),
          venue: data.venue,
          maximum_pax: data.maximum_pax,
          status: data.status ? data.status === 'Published' ? 'Approved' : data.status : 'Pending Review', // If no status assign Pending Review
          points_reward: 0,
          parents: this.parents,
          teachers: this.teachers,
          managers: this.managers,
          principals: this.principals,
          invite_hq: data.invite_hq ? data.invite_hq : false,
          image_url: data.image_url ? data.image_url : ''
        });
      }).catch((err) => {
        console.log(err)
        alert(err.error.message)
      });
    })
  }

  getAllUsers() {
    return new Promise((resolve, reject) => {
      this.onBranchChange((response) => {
        if (response.error) {
          reject(response)
        } else {
          resolve(response)
        }
      })
    })
  }


  // Multi-Select Forms
  onSelectBranch(e: {branch_id: number, branch_text: string}) {
    this.branches.push({'branch_id': e.branch_id})
    this.onBranchChange();
  }

  onSelectAllBranches(e: {branch_id: number, branch_text: string}[]) {
    this.branches =
    e.map(b => {
      return {
        branch_id: b.branch_id
      }
    })
    this.onBranchChange();
  }

  onDeSelectBranch(e) {
    const branchArray = this.branches.map(b => b.branch_id).indexOf(e.branch_id);
    if (branchArray > -1) {
      this.branches.splice(branchArray, 1);
    }
    this.onBranchChange();
  }

  onDeselectAllBranches(e) {
    this.branches = [];
    this.onBranchChange();
  }

  onBranchChange(callback = null) {
    console.log(this.eventForm.value)
    const branch_ids: number[] = this.branches.map(b => b.branch_id);

    // reset all selected and list
    if (!callback) {
      this.parentDropdownList = [];
      this.managersDropdownList = [];
      this.teachersDropdownList = [];
      this.principalsDropdownList = [];

      this.eventForm.get('parents').setValue([])
      this.eventForm.get('managers').setValue([])
      this.eventForm.get('teachers').setValue([])
      this.eventForm.get('principals').setValue([])
      this.parents = [];
      this.managers = [];
      this.teachers = [];
      this.principals = [];
    }

    if (branch_ids.length) {
      forkJoin([
        this.userService.listParentMultipleBranch(branch_ids),
        this.userService.listManagerMultipleBranch(branch_ids),
        this.userService.listTeacherMultipleBranch(branch_ids),
        this.userService.listPrincipalMultipleBranch(branch_ids),
      ]).subscribe(results => {
        this.parentDropdownList = this.mapUsers(results[0]);
        this.managersDropdownList = this.mapUsers(results[1]);
        this.teachersDropdownList = this.mapUsers(results[2]);
        this.principalsDropdownList = this.mapUsers(results[3]);

        if (callback) {
          callback(true);
        }
      }, err => {
        console.log({err})
        if (callback) {
          callback(err);
        } else {
          alert(err.error.message)
        }
      })
    }
  }

  mapUsers(users) {
    return users.map(d => {
      return {
        user_id: d.id,
        user_text: d.name
      }
    });
  }

  onSelectParents(e: {user_id: number, user_text: string}) {
    this.parents.push({'user_id': e.user_id});
  }

  onSelectAllParents(e: {user_id: number, user_text: string}[]) {
    this.parents =
    e.map(b => {
      return {
        user_id: b.user_id
      }
    })
  }

  onDeselectParents(e: {user_id: number, user_text: string}) {
    const parentArray = this.parents.map(b => b.user_id).indexOf(e.user_id);
    console.log('parentArray', parentArray);
    if (parentArray > -1) {
      this.parents.splice(parentArray, 1);
    }
  }

  onDeselectAllParents(e: []) {
    this.parents = [];
  }

  onSelectPrincipals(e: {user_id: number, user_text: string}) {
    this.principals.push({'user_id': e.user_id});
  }

  onSelectAllPrincipals(e: {user_id: number, user_text: string}[]) {
    this.principals =
    e.map(b => {
      return {
        user_id: b.user_id
      }
    })
  }

  onDeselectPrincipals(e: {user_id: number, user_text: string}) {
    const principalArray = this.principals.map(b => b.user_id).indexOf(e.user_id);
  }

  onDeselectAllPrincipals(e: []) {
    this.principals = [];
  }

  onSelectManagers(e: {user_id: number, user_text: string}) {
    this.managers.push({'user_id': e.user_id});
  }

  onSelectAllManagers(e: {user_id: number, user_text: string}[]) {
    this.managers =
    e.map(b => {
      return {
        user_id: b.user_id
      }
    })
  }

  onDeselectManagers(e: {user_id: number, user_text: string}) {
    const managerArray = this.managers.map(b => b.user_id).indexOf(e.user_id);
    if (managerArray > -1) {
      this.managers.splice(managerArray, 1);
    }
  }

  onDeselectAllManagers(e: []) {
    this.managers = [];
  }

  onSelectTeachers(e: {user_id: number, user_text: string}) {
    this.teachers.push({'user_id': e.user_id});
  }

  onSelectAllTeachers(e: {user_id: number, user_text: string}[]) {
    this.teachers =
    e.map(b => {
      return {
        user_id: b.user_id
      }
    })
  }

  onDeselectTeachers(e: {user_id: number, user_text: string}) {
    const teacherArray = this.teachers.map(b => b.user_id).indexOf(e.user_id);
    if (teacherArray > -1) {
      this.teachers.splice(teacherArray, 1);
    }
  }

  onDeselectAllTeachers(e: []) {
    this.teachers = [];
  }

  // Time and Date Picker

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

  convertToTimePickerFormat(time: string) {
    // Converts 12:00 to {hour: 12, minute: 0} for timepicker use

    const timeArray = time.split(':');
    return {
      hour: +timeArray[0],
      minute: +timeArray[1],
    }
  }

  convertTimePickerFormatForSubmit(time: {hour: number, minute: number}) {
    // Converts {hour: 14, minute: 30} to 14:30 for submit to server
    return ('0' + time.hour.toString()).slice(-2) + ':' + ('0' + time.minute.toString()).slice(-2);
  }

  // CRUDS


  onSubmit() {
    this.submitted = true;
    this.eventForm.get('branch_id').patchValue(this.branch_id);
    if (!this.eventForm.valid) {
      alert('invalid form');
      console.log(this.eventForm);
      return;
    }

    // Remaping Submit to Server
    const body = this.eventForm.value;
    body.branch_id = this.branch_id;
    body.start_datetime =
    this.convertDatePickerFormatForSubmit(body.start_date) + ' ' + this.convertTimePickerFormatForSubmit(body.start_time);
    body.end_datetime =
    this.convertDatePickerFormatForSubmit(body.end_date) + ' ' + this.convertTimePickerFormatForSubmit(body.end_time);
    delete body.start_date;
    delete body.start_time;
    delete body.end_date;
    delete body.end_time;

    if (!body.invite_hq) {
      body.invite_hq = false;
    }

    console.log(this.eventForm)

    body.invites = {};

    body.invites.branches = body.branches?.length > 0 ? body.branches.map(p => {
      return {branch_id: p.branch_id}
    }) : [];
    delete body.branches;

    body.invites.principals = body.principals?.length > 0 ? body.principals.map(p => {
      return {user_id: p.user_id}
    }) : [];
    delete body.principals;

    body.invites.managers = body.managers?.length > 0 ? body.managers.map(p => {
      return {user_id: p.user_id}
    }) : [];
    delete body.managers;

    body.invites.teachers = body.teachers?.length > 0 ? body.teachers.map(p => {
      return {user_id: p.user_id}
    }) : [];
    delete body.teachers;

    body.invites.parents = body.parents?.length > 0 ? body.parents.map(p => {
      return {user_id: p.user_id}
    }) : [];
    delete body.parents;

    const hasInvites = this.checkInvationList(body.invites);

    if (this.isUpdate()) {
      if (!hasInvites) {
        return alert('Need to have at least one invitee to proceed')
      }

      this.calendarService.updateEvent(+this.id, body)
      .subscribe(
        () => {
          this.router.navigate(['../..'], {
            relativeTo: this.route,
            queryParams: {
              active: this.active
            },
            queryParamsHandling: 'merge',
          });
          alert('Update Successful');
        },
        err => {
          console.error(err);
          alert(`Unable to update event. ${JSON.stringify(err.error)}`)
        }
      )


    } else {
      // add new event
      if (!hasInvites) {
        return alert('Need to have at least one invitee to proceed')
      }

      this.calendarService.addEvent(body)
      .subscribe(
        () => {
          this.router.navigate(['../..'], {
            relativeTo: this.route,
            queryParams: {
              active: this.active
            },
            queryParamsHandling: 'merge',
          });
          alert('Create Event Successful');
        },
        err => {
          console.error(err);
          alert(`Unable to create Event. ${JSON.stringify(err.error)}`)
        }
      )
    }


  }

  checkInvationList(invitations): boolean {
    let pass = false;

    Object.keys(invitations).forEach(key => {
      if (invitations[key].length) {
        pass = true;
      }
    })

    return pass;
  }

  isUpdate(): boolean {
    return this.id !== 'new';
  }

  onUpload(event) {
    const file: File = event.target.files[0];

    this.mediaService.uploadImage(file.name, file)
    .subscribe(
      resp => {
        this.eventForm.get('image_url').setValue(resp.image_url);
      },
      err => console.error(`Unable to upload image. ${JSON.stringify(err.error)}`)
    )
  }

  removeImage() {
    this.eventForm.get('image_url').setValue(null);
  }

  ngOnDestroy() {
    this.branch$$.unsubscribe();
  }



}
