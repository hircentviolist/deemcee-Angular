import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from 'app/enrollment.service';
import {FormControl, FormGroup} from '@angular/forms';
import { EnrollmentListItem } from 'app/model/enrollment-list-item';
import { Observable, Subscription } from 'rxjs';
import {debounceTime, distinctUntilChanged, shareReplay, take, map} from 'rxjs/operators';
import {Grade} from '../../model/grade';
import {StructureService} from '../../structure/structure.service';
import {EnrollmentListPayment, EnrollmentListPaymentDto} from '../../model/enrollment-list-payment';
import * as moment from 'moment';
import {PayComponent} from '../modal/pay/pay.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DefaultBranchService} from '../../default-branch.service';
import {TransferInComponent} from '../modal/transfer/transfer-in/transfer-in.component';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { DataForSelect } from 'app/model/data-for-select';
import {VideoAssignmentComponent} from '../modal/video-assignment/video-assignment.component';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import { TitleService } from 'app/shared/title.service';
import { PromoCodeComponent } from '../modal/promo-code/promo-code.component';
import { faStickyNote } from '@fortawesome/free-regular-svg-icons';
import {NoteComponent} from '../modal/note/note.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  faStickyNote = faStickyNote;
  enrollmentForm: FormGroup;
  enrollment$: Observable<EnrollmentListPaymentDto>;
  inactiveEnrolment$: Observable<EnrollmentListPaymentDto>;
  freezedEnrolment$: Observable<EnrollmentListPaymentDto>;
  studentExport$: Observable<any>;

  grade$: Observable<Grade[]>;
  nextPaymentDate: string;
  branch_id: number;
  branch$: Observable<DataForSelect[]>;
  defaultBranch$$: Subscription;
  search$$: Subscription;
  role: string;
  filterForm: FormGroup;
  showFilter = false;
  mappedGrades = [];
  sortList = [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'start_date',
      label: 'Start Date',
    },
    {
      key: 'end_date',
      label: 'End Date',
    },
  ];
  feeStatuses = [
    {
      key: true,
      label: 'Paid',
    },
    {
      key: false,
      label: 'Pending Payment',
    }
  ];
  isActiveList = true;
  tabNo = 1;
  pages = [];

  constructor(
      private licenseeService: LicenseeService,
      private enrollmentService: EnrollmentService,
      private structureService: StructureService,
      private defaultBranchService: DefaultBranchService,
      private modalService: NgbModal,
      private titleService: TitleService,
      private route: ActivatedRoute,
      private authService: AuthService,
      private router: Router
  ) {
    this.titleService.postTitle('Enrolment');
    authService.credential$
      .pipe(
        take(1)
      )
      .subscribe(
        auth => {
          this.role = auth.role;
        }
      );
  }

  ngOnInit(): void {

    this.branch$ = this.branch$ = this.licenseeService.getBranchForSelect();
    this.defaultBranch$$ = this.defaultBranchService.defaultBranch$
      .subscribe(branch_id => {
        if (branch_id) {
          this.branch_id = branch_id;
          if (this.filterForm) {
            this.filterForm.get('page').setValue(1);
          }
          this.populateList();
        }
      });
    this.initializeForm();
    this.listenToSearch();
  }

  showPromoCode() {
    this.modalService.open(PromoCodeComponent, {
      size: 'xl',
      scrollable: true,
    });
  }

  initializeForm() {
    this.filterForm = new FormGroup({
      'search': new FormControl(''),
      'sort_by': new FormControl(''),
      'grade_id': new FormControl(''),
      'is_paid': new FormControl(''),
      'range_start': new FormControl(''),
      'range_end': new FormControl(''),
      'page': new FormControl(1),
      'per_page': new FormControl(20),
    })
  }

  listenToSearch() {
    this.search$$ = this.filterForm.get('search').valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(search => {
        if (search !== '') {
          this.filterForm.patchValue({
            sort_by: '',
            grade_id: '',
            is_paid: null,
            range_start: '',
            range_end: '',
          });
          this.showFilter = false;
        }

        // for search filter, page will be reset to page 1
        const filters = {...this.filterForm.value, page: 1};

        if (this.tabNo === 1) {
          this.enrollment$ = this.enrollmentService.getListPayment(this.branch_id, filters).pipe(
            shareReplay(),
            map(this.formatData)
          );
          this.initPagination(this.enrollment$);
        } else if (this.tabNo === 2) {
          this.inactiveEnrolment$ = this.enrollmentService.getInactiveEnrolments(this.branch_id, filters).pipe(
            shareReplay(),
            map(this.formatData)
          );
          this.initPagination(this.inactiveEnrolment$);
        } else {
          this.freezedEnrolment$ = this.enrollmentService.getFreezedEnrolments(this.branch_id, filters).pipe(
            shareReplay(),
            map(this.formatData)
          );
          this.initPagination(this.freezedEnrolment$);
        }
        this.processEnrolment();
      })
  }

  populateList() {
    this.grade$ = this.structureService.getAllGrades();
    this.grade$.subscribe(grades => {
      grades.map(grade => {
        if (!Object.keys(this.mappedGrades).includes(String(grade.id))) {
          this.mappedGrades[String(grade.id)] = grade;
        }
      });

      if (this.tabNo === 1) {
        this.enrollment$ = this.enrollmentService.getListPayment(this.branch_id, this.filterForm.value).pipe(
          shareReplay(),
          map(this.formatData)
        );

        this.initPagination(this.enrollment$);
      } else if (this.tabNo === 2) {
        this.inactiveEnrolment$ = this.enrollmentService.getInactiveEnrolments(this.branch_id, this.filterForm.value).pipe(
          shareReplay(),
          map(this.formatData)
        );

        this.initPagination(this.inactiveEnrolment$);
      } else {
        const filters = {
          ...this.filterForm.value,
          start_date: moment().startOf('month').format('YYYY-MM-DD'),
          end_date: moment().endOf('month').format('YYYY-MM-DD'),
        }
        this.freezedEnrolment$ = this.enrollmentService.getFreezedEnrolments(this.branch_id, filters).pipe(
          shareReplay(),
          map(this.formatData)
        );

        this.initPagination(this.freezedEnrolment$);
      }

      this.processEnrolment();
    });
  }

  formatData(response) {
    response.data = response.data.map((student: any, i) => {
      const { start_date, end_date } = student.enrolment;
      const { current_page, per_page } = response.meta;

      student.term_start_date = start_date;
      student.term_end_date = end_date;
      student.number = (i + 1) + ((current_page - 1 ) * per_page);
      student.payment_made = student.payment_details ? +student.payment_details.amount - +student.payment_details.discount : null;
      return student;
    })
    return response;
  }

  initPagination(enrolmentOservable) {
    enrolmentOservable.subscribe(enrolments => {
      this.filterForm.get('page').setValue(enrolments.meta.current_page);
      this.pages = [];

      if (enrolments.data.length) {
        for (let i = 0; i < enrolments.meta.last_page; i++) {
          this.pages.push({
            number: i + 1,
            is_active: this.filterForm.get('page').value === (i + 1)
          });
        }
      }
    })
  }

  paginationClicked(page) {
    const element = document.querySelector('#scrollDiv');
    element.scrollIntoView();

    const currentPage = this.pages.find(p => p.is_active);
    let toPage = null;

    if (page === 'next') {
      toPage = +currentPage.number + 1;

      if (toPage > this.pages.length) {
        return;
      }

      this.pages.forEach(p => p.is_active = false);
      this.pages.find(p => {
        p.is_active = +p.number === +toPage
        return p.is_active;
      })
    } else if (page === 'prev') {
      toPage = +currentPage.number - 1;

      if (toPage <= 0) {
        return;
      }

      this.pages.forEach(p => p.is_active = false);
      this.pages.find(p => {
        p.is_active = +p.number === +toPage
        return p.is_active;
      })
    } else {
      this.pages.forEach(p => p.is_active = false);
      page.is_active = true;
      toPage = page.number;
    }

    if (toPage) {
      this.filterForm.get('page').setValue(toPage);
      this.populateList();
    }
  }

  processEnrolment() {
    const enrolments = [
      this.enrollment$,
      this.inactiveEnrolment$,
      this.freezedEnrolment$
    ]
    const enrolment = enrolments[this.tabNo - 1];

    enrolment.subscribe(enrolmentDto => {
      const enrolmentObjects = enrolmentDto.data;
      enrolmentObjects.map(enrolmentObj => {
        enrolmentObj.grade_obj = this.mappedGrades[enrolmentObj.grade];
        if (enrolmentObj.payment_details?.created_at) {
          enrolmentObj.payment_details.created_at = moment(enrolmentObj.payment_details.created_at).format('YYYY-MM-DD');
        }
        if (enrolmentObj.payment_details?.updated_at) {
          enrolmentObj.payment_details.updated_at = moment(enrolmentObj.payment_details.updated_at).format('YYYY-MM-DD');
        }
        if (enrolmentObj.payment_details?.date) {
          enrolmentObj.payment_details['paid_at'] = moment(enrolmentObj.payment_details.date).format('YYYY-MM-DD');
        }
        enrolmentObj.end_date = moment(enrolmentObj.end_date).format('YYYY-MM-DD');
        this.nextPaymentDate = moment(enrolmentObj.end_date).subtract(14, 'days').format('YYYY-MM-DD');

        enrolmentObj.video_array.forEach((video, i) => {
          video.label = video.submission_date ? `Video ${video.video_number}` : `V${video.video_number} (${video.submit_before})`;
        });
        // if (enrolment.video_array.length) {
        //   enrolment.video_array.map(video => {
        //     if (video.video_number === 1) {
        //       enrolment.video_one = video;
        //     }
        //     if (video.video_number === 2) {
        //       enrolment.video_two = video;
        //     }
        //   });
        // }
        // enrolment.video_one_date = moment(enrolment.end_date).subtract(90, 'days').format('YYYY-MM-DD');
        // enrolment.video_two_date = moment(enrolment.end_date).subtract(14, 'days').format('YYYY-MM-DD');
      });
    });
  }

  onVideoClicked(enr, video) {
    if (video.submission_date) {
      this.router.navigate(['../video/' + video.id], {relativeTo: this.route})
    } else {
      const data = {
        ...video,
        student_id: enr.id,
        student_name: enr.name,
        category_id: enr.grade_obj.category_id,
      }
      console.log(data)
      const modalRef = this.modalService.open(VideoAssignmentComponent);
      modalRef.componentInstance.data = data;

      modalRef.result.then(resp => {
        this.enrollmentService.updateVideoAssignment(this.branch_id, resp).subscribe(res => {
          this.ngOnInit();
        })
      }, err => {})
    }
  }

  onPay(name, grade, payment_details) {
    if (this.role !== 'teacher' && payment_details) {
      const modalRef = this.modalService.open(PayComponent);
      payment_details.name = name;
      payment_details.grade = grade;
      modalRef.componentInstance.data = payment_details;
      modalRef.result.then(resp => {
        if (resp) {
          this.populateList();
        }
      })
    }
  }

  showTransferIn() {
    const modalRef = this.modalService.open(TransferInComponent);
    const branch_id = this.branch_id;
    modalRef.componentInstance.data = {branch_id};
    modalRef.result.then(resp => {
      this.ngOnInit();
    }, err => {})
  }

  ngOnDestroy(): void {
    this.defaultBranch$$.unsubscribe();
  }

  onVideoOneClicked(enr) {
    if (this.role === 'principal' || this.role === 'manager' || this.role === 'teacher') {
      const videoObjArray = [];
      if (enr.video_array.length) {
        enr.video_array.map(video => {
          if (video.video_number === 1) {
            videoObjArray.push(video);
          }
        })
      }
      if (videoObjArray.length) {
        this.router.navigate(['../video/' + videoObjArray[0].id], {relativeTo: this.route})
      } else {
        const modalRef = this.modalService.open(VideoAssignmentComponent);
        const video_number = 1;
        const studentName = enr.name;
        const categoryId = enr.grade_obj.category_id;
        const enrolmentId = enr.enrolment.id;
        const studentId = enr.enrolment.student_id;
        modalRef.componentInstance.data = {video_number, enrolmentId, studentId, studentName, categoryId, videoObjArray};
        modalRef.result.then(resp => {
          this.enrollmentService.submitVideoAssignment(this.branch_id, resp).subscribe(res => {
            this.ngOnInit();
          })
        }, err => {})
      }
    } else {
      alert('Only Principals & Managers can access this video.')
    }
  }

  onVideoTwoClicked(enr) {
    if (this.role === 'principal' || this.role === 'manager' || this.role === 'teacher') {
      const videoObjArray = [];
      if (enr.video_array.length) {
        enr.video_array.map(video => {
          if (video.video_number === 2) {
            videoObjArray.push(video);
          }
        })
      }
      if (videoObjArray.length) {
        this.router.navigate(['../video/' + videoObjArray[0].id], {relativeTo: this.route})
      } else {
        const modalRef = this.modalService.open(VideoAssignmentComponent);
        const video_number = 2;
        const studentName = enr.name;
        const categoryId = enr.grade_obj.category_id;
        const enrolmentId = enr.enrolment.id;
        const studentId = enr.enrolment.student_id;
        modalRef.componentInstance.data = {video_number, enrolmentId, studentId, studentName, categoryId, videoObjArray};
        modalRef.result.then(resp => {
          this.enrollmentService.submitVideoAssignment(this.branch_id, resp).subscribe(res => {
            this.ngOnInit();
          })
        }, err => {
        })
      }
    } else {
      alert('Only Principals & Managers can access this video.')
    }
  }

  setSortBy() {
  }

  setFeeStatusFilter() {
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  convertDatePickerFormatForSubmit(date: {year: number, month: number, day: number}) {
    // Converts {year: 2020, month: 10, day: 25} to 2020-10-25 for submit to server
    return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
  }

  applyFilter() {
    this.filterForm.get('search').patchValue('');
    this.filterForm.get('page').setValue('1');
    const body = this.filterForm.value;
    body.range_start = body.range_start ? this.convertDatePickerFormatForSubmit(body.range_start) : '';
    body.range_end = body.range_end ? this.convertDatePickerFormatForSubmit(body.range_end) : '';

    if (this.tabNo === 1) {
      this.enrollment$ = this.enrollmentService.getListPayment(this.branch_id, this.filterForm.value).pipe(
        shareReplay(),
        map(this.formatData)
      );
      this.initPagination(this.enrollment$);
    } else if (this.tabNo === 2) {
      this.inactiveEnrolment$ = this.enrollmentService.getInactiveEnrolments(this.branch_id, this.filterForm.value).pipe(
        shareReplay(),
        map(this.formatData)
      );
      this.initPagination(this.inactiveEnrolment$);
    } else {
      const filters = {
        ...this.filterForm.value,
        start_date: moment().startOf('month').format('YYYY-MM-DD'),
        end_date: moment().endOf('month').format('YYYY-MM-DD'),
      }
      this.freezedEnrolment$ = this.enrollmentService.getFreezedEnrolments(this.branch_id, filters).pipe(
        shareReplay(),
        map(this.formatData)
      );
      this.initPagination(this.freezedEnrolment$);
    }

    this.processEnrolment();
  }

  resetFilter() {
    const hasFilter = Object.keys(this.filterForm.controls).some(key => {
      if (this.filterForm.controls[key].value) {
        return true;
      }
      return false;
    });

    if (hasFilter) {
      this.filterForm.reset();

      if (this.tabNo === 1) {
        this.enrollment$ = this.enrollmentService.getListPayment(this.branch_id, this.filterForm.value).pipe(
          shareReplay(),
          map(this.formatData)
        );
        this.initPagination(this.enrollment$);
      } else if (this.tabNo === 2) {
        this.inactiveEnrolment$ = this.enrollmentService.getInactiveEnrolments(this.branch_id, this.filterForm.value).pipe(
          shareReplay(),
          map(this.formatData)
        );
        this.initPagination(this.inactiveEnrolment$);
      } else {
        const filters = {
          ...this.filterForm.value,
          start_date: moment().startOf('month').format('YYYY-MM-DD'),
          end_date: moment().endOf('month').format('YYYY-MM-DD'),
        }
        this.freezedEnrolment$ = this.enrollmentService.getFreezedEnrolments(this.branch_id, filters).pipe(
          shareReplay(),
          map(this.formatData)
        );
        this.initPagination(this.freezedEnrolment$);
      }
      this.processEnrolment();
    }
  }

  onChangeTab() {
    this.pages = [];
    this.filterForm.get('page').setValue(1);
    if (this.tabNo === 1 && !this.isActiveList) {
      this.isActiveList = true;
    } else if (this.tabNo === 2 && this.isActiveList) {
      this.isActiveList = false;
    }
    this.populateList();
  }

  capitalise(string) {
    if (string && string !== '') {
      const splitStr = string.toLowerCase().split(' ');

      for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] =
          splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
      }

      return splitStr.join(' ');
    }
  }

  onNoteClick(enr) {
    const modalRef = this.modalService.open(NoteComponent);
    modalRef.componentInstance.data = enr;
    modalRef.result.then(resp => {
      if (resp) {
        this.populateList();
      }
    })
  }

  exportStudents() {
    this.studentExport$ = this.enrollmentService.exportStudents(this.branch_id)
    this.studentExport$.subscribe(res => {
      const formattedData = [];
      res.map(student => {
        let statusStr = '';
        switch (student.status) {
          case 'IN_PROGRESS':
            statusStr = 'Active';
            break;
          case 'GRADUATED':
            statusStr = 'Graduated';
            break;
          case 'FREEZED':
            statusStr = 'Freezed';
            break;
          case 'EXTENDED':
            statusStr = 'Extended';
            break;
          case 'DROPPED_OUT':
            statusStr = 'Dropped';
            break;
        }
        const formattedItem = {
          student_name: student.name,
          student_dob: student.dob,
          student_gender: student.gender,
          enrolled_date: student.enrolment_date,
          latest_grade: student.latest_grade.name,
          status: statusStr,
          graduated_date: student.status === 'GRADUATED' ? student.end_date : '',
          dropped_date: student.status === 'DROPPED_OUT' ? student.end_date : '',
          branch: student.branch.name,
          parent_name: student.parent.name,
          parent_gender: student.parent.gender,
          phone_number: student.parent.phone_number,
          occupation: student.parent.occupation ? student.parent.occupation : '',
        }
        formattedData.push(formattedItem);
      })
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook: XLSX.WorkBook = { Sheets: { 'students': worksheet }, SheetNames: ['students'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, `Student_Export_${res[0].branch.name}_${moment().format('YYYY-MM-DD')}`);
    })
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}
