import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription, empty } from 'rxjs';
import { DataForSelect } from 'app/model/data-for-select';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { StructureService } from 'app/structure/structure.service';
import {map, take, distinctUntilChanged, tap, switchMap, debounceTime} from 'rxjs/operators';
import { DAYS } from 'app/resource/days';
import { GENDER } from 'app/resource/gender';
import { STATES } from 'app/resource/states';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DefaultBranchService } from 'app/default-branch.service';
import { EnrollmentService } from 'app/enrollment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PayComponent } from '../modal/pay/pay.component';
import {CalendarService} from '../../calendar/calendar.service';
import {UserService} from '../../user/user.service';
import * as moment from 'moment';
import {Grade} from '../../model/grade';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit, OnDestroy {

  branch$: Observable<DataForSelect[]>;
  grade$: Observable<Grade[]>;
  day$: Observable<DataForSelect[]>;
  gender$: Observable<DataForSelect[]>;
  commencement$: Observable<DataForSelect[]>;
  state$: Observable<any[]>;
  slot$: Observable<DataForSelect[]>;
  enrollmentForm: FormGroup;
  defaultBranch$$: Subscription;
  email$$: Subscription;
  branch_id: number;
  states = STATES;
  submitted = false;
  commencementDate$$: Subscription;
  max_commencement_date: Date;
  selected_grade_id: number;
  parentObject: any;
  referralChannels: {id: number, name: string} [] = [];
  selectedStarterKits: {id: number, name: string}[] = [];
  starterKits: {id: number, name: string}[];
	dropdownSettings: IDropdownSettings;
  isLoading: boolean = false;
  showParentForm: boolean = false;

  constructor(
    private defaultBranchService: DefaultBranchService,
    private licenseeService: LicenseeService,
    private structureService: StructureService,
    private enrollmentService: EnrollmentService,
    private calendarService: CalendarService,
    private userService: UserService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private config: NgbTimepickerConfig,
    private router: Router) {
      this.dropdownSettings = {
        textField: 'name',
        singleSelection: false,
        itemsShowLimit: 3,
        limitSelection: 3,
        allowSearchFilter: true,
      }
    }

  ngOnInit(): void {
    this.branch$ = this.licenseeService.getBranchForSelect();
    this.grade$ = this.structureService.getAllGrades();
    this.day$ = of(DAYS);
    this.gender$ = of(GENDER);
    this.state$ = of(STATES);
    this.max_commencement_date = moment().add(1, 'month').toDate();
    this.defaultBranch$$ =
    this.defaultBranchService.defaultBranch$
    .subscribe(branch_id => {
      console.log('branch_id: ', branch_id);
      if (branch_id) {
        this.branch_id = branch_id;

        this.enrollmentService.getAvailableStarterKits(branch_id).subscribe(res => {
          this.starterKits = res.map(item => {
            return {
              id: item.id,
              name: item.name
            }
          })
        });
      }
    });
    this.initializeForm();
    this.listenToCommencementDate();
    this.listenToEmail();
    this.getReferralChannels();
  }

  getReferralChannels() {
    this.enrollmentService.getReferralChannelList().subscribe(res => {
      this.referralChannels = res;
    }, err => {
      console.log({err})
    })
  }

  initializeForm() {
    this.enrollmentForm =
    new FormGroup({
      'parent': new FormGroup({
        'branch_id': new FormControl(''),
        'first_name': new FormControl('', Validators.required),
        'last_name': new FormControl(''),
        'email': new FormControl('', Validators.required),
        'phone': new FormControl('', Validators.required),
        'dob': new FormControl(''),
        'gender': new FormControl('', Validators.required),
        'occupation': new FormControl('', Validators.required),
        'spouse_name': new FormControl(''),
        'spouse_phone': new FormControl(''),
        'spouse_occupation': new FormControl(''),
        'address': new FormGroup({
            'address_line_1': new FormControl('', Validators.required),
            'address_line_2': new FormControl(''),
            // 'address_line_3': new FormControl('', Validators.required),
            'postcode': new FormControl('', Validators.required),
            'city': new FormControl('', Validators.required),
            'state': new FormControl('', Validators.required),
        }),
      }),
      'branch_id': new FormControl(''),
      'first_name': new FormControl('', Validators.required),
      'last_name': new FormControl(''),
      'gender': new FormControl('', Validators.required),
      'grade_id': new FormControl('', Validators.required),
      'dob': new FormControl('', Validators.required),
      'school': new FormControl('', Validators.required),
      'deemcee_starting_grade_id': new FormControl(''),
      'deemcee_starting_grade': new FormControl(''),
      'commencement_date': new FormControl('', Validators.required),
      'enrolment_date': new FormControl(''),
      'timeslot': new FormControl('', Validators.required),
      'class_id': new FormControl('', Validators.required),
      'voucher': new FormControl(''),
      'starter_kits': new FormControl([]),
      'referral_channel_id': new FormControl(''),
      'referral': new FormControl(''),
    })
  }

  listenToCommencementDate() {
    this.commencementDate$$ = this.enrollmentForm.get('commencement_date').valueChanges
        .pipe(
            debounceTime(300),
            distinctUntilChanged()
        )
        .subscribe(commencement_date => {
          console.log('commencement_date: ', this.convertDatePickerFormatForSubmit(commencement_date));
          if (this.enrollmentForm.get('commencement_date').valid) {
            if (this.selected_grade_id) {
              this.slot$ =
                this.calendarService.getSuitableClasses(
                  this.branch_id, this.convertDatePickerFormatForSubmit(commencement_date), this.selected_grade_id)
                  .pipe(
                      map(slots => slots.map(slot => {
                        return {
                          id: slot.id,
                          name: slot.start_time.substring(0, 5) + ' - ' +
                            slot.end_time.substring(0, 5) + ' | ' +
                            slot.label + ' (' +
                            // slot.number_enrolled + '/' +
                            slot.enrolments_count + '/' +
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
    console.log('convertDatePickerFormatForSubmit, year: ', date.year);
    console.log('convertDatePickerFormatForSubmit, month: ', date.month);
    console.log('convertDatePickerFormatForSubmit, day: ', date.day);
    return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
  }

  onGradeChanged(grade_id) {
    this.selected_grade_id = grade_id;
    if (this.enrollmentForm.get('commencement_date').valid) {
      this.slot$ = this.calendarService
          .getSuitableClasses(
              this.branch_id,
              this.convertDatePickerFormatForSubmit(this.enrollmentForm.get('commencement_date').value),
              grade_id)
          .pipe(
              map(slots => slots.map(slot => {
                console.log('slot: ', slot);
                    return {
                      id: slot.id,
                      name: slot.start_time.substring(0, 5) + ' - ' +
                        slot.end_time.substring(0, 5) + ' | ' +
                        slot.label + ' (' +
                        // slot.number_enrolled + '/' +
                        slot.enrolments_count + '/' +
                        6 + ')',
                        // slot.max_class_size + ')',
                    }
                  })
              )
          )
    }
  }

  onSlotChanged(slot_id) {
    this.enrollmentForm.get('class_id').setValue(slot_id);
  }

  listenToEmail() {
    this.email$$ =
        this.enrollmentForm.get('parent.email').valueChanges
            .pipe(
                debounceTime(250),
                distinctUntilChanged()
            )
            .subscribe(email => {
              if (this.enrollmentForm.get('parent.email').valid) {
                this.email$$ =
                    this.userService.getParentsByEmail(email)
                        .subscribe(parent => {
                          this.showParentForm = false;
                          alert('Parent account found');
                          this.parentObject = parent;
                          this.enrollmentForm.get('parent.branch_id').setValue(parent.branch.id);
                          this.enrollmentForm.get('parent.first_name').setValue(parent.first_name);
                          this.enrollmentForm.get('parent.last_name').setValue(parent.last_name);
                          this.enrollmentForm.get('parent.phone').setValue(parent.phone);
                          this.enrollmentForm.get('parent.dob').setValue(this.convertToDatePickerFormat(parent.dob));
                          this.enrollmentForm.get('parent.gender').setValue(parent.gender);
                          this.enrollmentForm.get('parent.occupation').setValue(parent.occupation);
                          this.enrollmentForm.get('parent.spouse_name').setValue(parent.spouse_name);
                          this.enrollmentForm.get('parent.spouse_phone').setValue(parent.spouse_phone);
                          this.enrollmentForm.get('parent.spouse_occupation').setValue(parent.spouse_occupation);
                          this.enrollmentForm.get('parent.address.address_line_1').setValue(parent.address.address_line_1);
                          this.enrollmentForm.get('parent.address.address_line_2').setValue(parent.address.address_line_2);
                          this.enrollmentForm.get('parent.address.postcode').setValue(parent.address.postcode);
                          this.enrollmentForm.get('parent.address.city').setValue(parent.address.city);
                          this.enrollmentForm.get('parent.address.state').setValue(parent.address.state);
                        }, error => {
                          if (this.validEmail(email)) {
                            this.showParentForm = true;
                          } else {
                            this.showParentForm = false;
                          }
                          this.parentObject = null;
                          this.enrollmentForm.get('parent.branch_id').setValue(null);
                          this.enrollmentForm.get('parent.first_name').setValue(null);
                          this.enrollmentForm.get('parent.last_name').setValue(null);
                          this.enrollmentForm.get('parent.phone').setValue(null);
                          this.enrollmentForm.get('parent.dob').setValue(null);
                          this.enrollmentForm.get('parent.gender').setValue(null);
                          this.enrollmentForm.get('parent.occupation').setValue(null);
                          this.enrollmentForm.get('parent.spouse_name').setValue(null);
                          this.enrollmentForm.get('parent.spouse_phone').setValue(null);
                          this.enrollmentForm.get('parent.spouse_occupation').setValue(null);
                          this.enrollmentForm.get('parent.address.address_line_1').setValue(null);
                          this.enrollmentForm.get('parent.address.address_line_2').setValue(null);
                          this.enrollmentForm.get('parent.address.postcode').setValue(null);
                          this.enrollmentForm.get('parent.address.city').setValue(null);
                          this.enrollmentForm.get('parent.address.state').setValue(null);
                        });
              } else {
                this.showParentForm = false;
                this.parentObject = null;
                this.enrollmentForm.get('parent.branch_id').setValue(null);
                this.enrollmentForm.get('parent.first_name').setValue(null);
                this.enrollmentForm.get('parent.last_name').setValue(null);
                this.enrollmentForm.get('parent.phone').setValue(null);
                this.enrollmentForm.get('parent.dob').setValue(null);
                this.enrollmentForm.get('parent.gender').setValue(null);
                this.enrollmentForm.get('parent.occupation').setValue(null);
                this.enrollmentForm.get('parent.spouse_name').setValue(null);
                this.enrollmentForm.get('parent.spouse_phone').setValue(null);
                this.enrollmentForm.get('parent.spouse_occupation').setValue(null);
                this.enrollmentForm.get('parent.address.address_line_1').setValue(null);
                this.enrollmentForm.get('parent.address.address_line_2').setValue(null);
                this.enrollmentForm.get('parent.address.postcode').setValue(null);
                this.enrollmentForm.get('parent.address.city').setValue(null);
                this.enrollmentForm.get('parent.address.state').setValue(null);
              }
            });
    console.log('this.enrollmentForm: ', this.enrollmentForm)
  }

  validEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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

  onSubmit() {
    if (this.isLoading) {
      return;
    }
    // this.enrollmentForm.get('enrolment_date').setValue(moment().format('YYYY-MM-DD'));
    this.enrollmentForm.get('deemcee_starting_grade_id').setValue(parseInt(this.enrollmentForm.get('grade_id').value));
    this.enrollmentForm.get('deemcee_starting_grade').setValue(parseInt(this.enrollmentForm.get('grade_id').value));
    if (!this.enrollmentForm.valid) {
      console.log('this.enrollmentForm: ', this.enrollmentForm);
      alert('missing field');
      this.submitted = true;
      return;
    }
    Swal.fire({
      icon: 'question',
      title: 'Enrol student',
      text: `Are you sure you want to enrol ${this.enrollmentForm.get('first_name').value.toUpperCase()}?`,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: 'white',
      cancelButtonText: '<span style="color:grey">Cancel<span>',
      confirmButtonText: 'Yes',
    }).then(result => {
      if (result.value) {
        this.enrol();
      }
    });
  }

  enrol() {
    this.isLoading = true;
    // use branch_id from default
    this.defaultBranchService.defaultBranch$
    .pipe(
      take(1)
    )
    .subscribe(branch_id => {
      this.enrollmentForm.get('branch_id').setValue(branch_id);
      this.enrollmentForm.get('parent.branch_id').setValue(branch_id);
      const body: any = this.enrollmentForm.value;
      body.parent.dob = body.parent.dob ? this.convertDatePickerFormatForSubmit(body.parent.dob) : null;
      body.commencement_date = this.convertDatePickerFormatForSubmit(body.commencement_date);
      body.enrolment_date = body.commencement_date;
      console.log('body.dob: ', body.dob);
      body.dob = this.convertDatePickerFormatForSubmit(body.dob);

      this.enrollmentService.create(body, this.branch_id)
          .subscribe(resp => {
            this.isLoading = false;
            alert('Enrollment Successful');
            console.log('Enrollment Successful: ', resp);
            const payment_details = resp['payment_details'][0];
            payment_details.name = resp['name'];
            const modalRef = this.modalService.open(PayComponent);
            modalRef.componentInstance.data = payment_details;
            modalRef.result.then(res => {
              console.log('new, res: ', res);
              this.router.navigate(['../list/'], {relativeTo: this.route})
            })
          }, (err: HttpErrorResponse) => {
            this.isLoading = false;
            alert(err.error.message)
            console.log(err.error)
          })
    })
  }

  onNavigateToList() {
    this.router.navigate(['../list']);
  }

  ngOnDestroy() {
    this.defaultBranch$$.unsubscribe();
  }

  dropdownChanged() {
    this.enrollmentForm.controls['starter_kits'].setValue(this.selectedStarterKits)
  }
}
