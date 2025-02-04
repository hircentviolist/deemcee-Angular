import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdvanceComponent } from '../modal/advance/advance.component';
import { ExtendComponent } from '../modal/extend/extend.component';
import { FreezeComponent } from '../modal/freeze/freeze.component';
import { GraduateComponent } from '../modal/graduate/graduate.component';
import { DropoutComponent } from '../modal/dropout/dropout.component';
import { TransferComponent } from '../modal/transfer/transfer.component';
import { PayComponent } from '../modal/pay/pay.component';
import { DeleteComponent } from '../modal/delete/delete.component';
import {ActivatedRoute, Router} from '@angular/router';
import { EnrollmentService } from 'app/enrollment.service';
import { Observable, empty, Subscription } from 'rxjs';
import { shareReplay, map, switchMap, take } from 'rxjs/operators';
import { StructureService } from 'app/structure/structure.service';
import * as moment from 'moment';
import {EnrollmentListItem} from '../../model/enrollment-list-item';
import {Grade} from '../../model/grade';
import {DefaultBranchService} from '../../default-branch.service';
import {ClassLessonDto} from '../../model/class-lesson-dto';
import {EditComponent} from '../modal/edit/edit.component';
import { AuthService } from 'app/auth/auth.service';
import { ChangeClassComponent } from '../modal/change-class/change-class.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  id: number;
  enrollment$: Observable<EnrollmentListItem>;
  grade$: Observable<Grade[]>;
  day: string;
  start_time: string;
  end_time: string;
  payment_details: any;
  deemcee_starting_grade: Grade;
  nextPaymentDate: string;
  branch_id: number;
  studentNextGrade: Grade;
  enrolment: EnrollmentListItem;
  role: String;
  defaultBranch$$: Subscription;
  
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private enrollmentService: EnrollmentService,
    private structureService: StructureService,
    private modalService: NgbModal,
    private defaultBranchService: DefaultBranchService,
    private router: Router) {
      this.authService.credential$
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
    this.id = +this.route.snapshot.params.id;
    this.defaultBranch$$ = this.defaultBranchService.defaultBranch$
      .subscribe(branch_id => {
        if (branch_id) {
          this.branch_id = branch_id;
          this.getEnrolmentDetails();
        }
      });
  }

  getEnrolmentDetails(cb = null) {
    this.grade$ = this.structureService.getAllGrades();
    const mappedGrades = [];
    this.grade$.subscribe(grades => {
      grades.map(grade => {
        if (!Object.keys(mappedGrades).includes(String(grade.id))) {
          mappedGrades[String(grade.id)] = grade;
        }
      });
      if (this.id) {
        this.enrollment$ =
            this.enrollmentService.getById(this.id, this.branch_id)
                .pipe(
                    shareReplay()
                )
      }
      this.enrollment$.subscribe(enrolment => {
        console.log('enrolment: ', enrolment);
        this.enrolment = enrolment;
        enrolment.grade = mappedGrades[enrolment.current_grade_id];
        const commencementDay = enrolment.class_lesson[0].start_datetime;
        this.day = enrolment.enrolment.class.day;
        this.start_time = moment(commencementDay).format('hh:mm a');
        this.end_time = moment(enrolment.class_lesson[0].end_datetime).format('hh:mm a');
        this.deemcee_starting_grade = mappedGrades[enrolment.deemcee_starting_grade];
        if (enrolment.payment_details[0]?.created_at) {
          enrolment.payment_details[0].created_at = moment(enrolment.payment_details[0].created_at).format('YYYY-MM-DD');
        }
        if (enrolment.payment_details[0]?.updated_at) {
          enrolment.payment_details[0].updated_at = moment(enrolment.payment_details[0].updated_at).format('YYYY-MM-DD');
        }
        this.payment_details = enrolment.payment_details[0];
        this.enrolment = enrolment;
        switch (enrolment.grade.id) {
          case 1:
            this.studentNextGrade = mappedGrades['2'];
            break;
          case 2:
            this.studentNextGrade = mappedGrades['3'];
            break;
          case 3:
            this.studentNextGrade = mappedGrades['4'];
            break;
          case 4:
            this.studentNextGrade = mappedGrades['5'];
            break;
          case 5:
            this.studentNextGrade = mappedGrades['6'];
            break;
          case 6:
            this.studentNextGrade = null;
            break;
        }
        this.payment_details.name = enrolment.name;
        const lastClassIndex = enrolment.class_lesson.length - 1;
        const lastClassDate = enrolment.class_lesson[lastClassIndex].start_datetime;
        this.nextPaymentDate = moment(lastClassDate).subtract(14, 'days').format('YYYY-MM-DD');

        if (cb) cb();
      });
    });
  }

  onAdvance(): void {
    console.log('payment_details:' , this.payment_details);
    if (this.payment_details.status === 'paid') {
      const modalRef = this.modalService.open(AdvanceComponent);
      const enrolment = this.enrolment;
      const nextGrade = this.studentNextGrade;
      modalRef.componentInstance.data = {nextGrade, enrolment};
      modalRef.result.then(result => {
        if (result) {
          this.enrollmentService.advance(enrolment.enrolment.id, result).subscribe(resp => {
            alert('Advance Successful');
            const payment_details = resp['payment_details'][resp['payment_details'].length - 1];
            payment_details.name = resp['name'];
            this.payment_details = payment_details;
            this.onPay();
          }, err => {
            console.log('err: ', err);
            alert(err.error.message);
          });
        }
      })
    } else {
      alert('This student have a pending payment, please clear the payment before proceed.')
    }
  }

  onExtend() {
    console.log('payment_details:' , this.payment_details);
    if (this.payment_details.status === 'paid') {
      const modalRef = this.modalService.open(ExtendComponent);
      modalRef.componentInstance.data = {student: this.enrolment};
      modalRef.result.then(result => {
        if (result) {
          this.enrollmentService.extend(this.enrolment.enrolment.id, {
            ...result,
            number_of_months: 3
          }).subscribe(res => {
            console.log('onExtend, res: ', res);
            alert('Extend Successful');
            const payment_details = res['payment_details'][0];
            payment_details.name = res['name'];
            this.payment_details = payment_details;
            this.getEnrolmentDetails(() => this.onPay());
          }, err => {
            console.log('err: ', err);
            alert(err.error.message);
          })
        }
      }).catch(error => {
        console.log('onExtend, error: ', error);
      })
    } else {
      alert('This student have a pending payment, please clear the payment before proceed.')
    }
  }

  onGraduate() {
    const modalRef = this.modalService.open(GraduateComponent);
    const enrolment = this.enrolment;
    modalRef.componentInstance.data = {enrolment};
    modalRef.result.then(result => {
      if (result) {
        console.log('onGraduate, result: ', result);
        // enrolment.id = student_id
        this.enrollmentService.graduate(enrolment.id).subscribe(res => {
          alert(`Congratulations! ${enrolment.name} has successfully graduated!`);
          this.ngOnInit();
        }, err => {
          console.log('err: ', err);
          alert(err.error.message);
        })
      }
    }).catch(error => {
      console.log('onGraduate, error: ', error);
    })
  }

  onDropout() {
    const modalRef = this.modalService.open(DropoutComponent);
    const enrolment = this.enrolment;
    modalRef.componentInstance.data = {enrolment};
    modalRef.result.then(result => {
      if (result) {
        console.log('onDropout, result: ', result);
        // enrolment.id = student_id
        this.enrollmentService.dropout(enrolment.id).subscribe(res => {
          alert('Dropout Successful');
          this.ngOnInit();
        }, err => {
          console.log('err: ', err);
          alert(err.error.message);
        })
      }
    }).catch(error => {
      console.log('onDropout, error: ', error);
    })
  }

  onTransfer() {
    if (this.enrolment.status !== 'TRANSFERRED') {
      const modalRef = this.modalService.open(TransferComponent);
      const enrolment = this.enrolment;
      modalRef.componentInstance.data = {enrolment};
      modalRef.result.then(result => {
        if (result) {
          console.log('result: ', result);
          this.enrollmentService.transferOut(this.enrolment.id, result).subscribe(resp => {
            alert('Transfer Successful');
            this.ngOnInit();
          }, err => {
            console.log('err: ', err);
            alert(err.error.message);
          })
        }
      }).catch(error => {
        console.log('onTransfer, error: ', error);
      })
    } else {
      alert('This student is already being transferred.')
    }
  }

  onPay() {
    console.log('payment_details:' , this.payment_details);
    if (this.payment_details.status !== 'paid') {
      if (this.payment_details) {
        const modalRef = this.modalService.open(PayComponent);
        this.payment_details.grade = this.enrolment.grade.name;
        modalRef.componentInstance.data = this.payment_details;
        modalRef.result.then(res => {
          console.log('details, res:', res);
          this.ngOnInit();
        })
      }
    } else {
      alert('This student have cleared all payments.')
    }
  }

  onEditStudent() {
    const modalRef = this.modalService.open(EditComponent);
    const student = this.enrolment;
    const mode = 'student';
    modalRef.componentInstance.data = {student, mode};
    modalRef.result.then(result => {
      this.enrollmentService.updateStudentInfo(this.branch_id, student.id, result).subscribe(res => {
        this.ngOnInit();
      }, err => {
        console.log(err)
        alert(err.error.message)
      })
    }, error => {
      alert(error.error.message)
    })
  }

  onEditEnrol() {
    const modalRef = this.modalService.open(EditComponent);
    const student = this.enrolment;
    const mode = 'enrolment';
    modalRef.componentInstance.data = {student, mode};
    modalRef.result.then(result => {
      this.enrollmentService.updateEnrolment(this.branch_id, student.enrolment.id, result).subscribe(res => {
        this.ngOnInit();
      }, err => {
        console.log(err)
        alert(err.error.message)
      })
    }, error => {
    })
  }

  onDelete() {
    const modalRef = this.modalService.open(DeleteComponent);
    const student = this.enrolment;
    modalRef.componentInstance.data = {student};
    modalRef.result.then(result => {
      if (result) {
        this.enrollmentService.delete(this.branch_id, result).subscribe(res => {
          this.router.navigate(['../../list'], {relativeTo: this.route})
        }, err => {
          console.log('err: ', err);
          alert(err.error.message);
        })
      }
    })
  }
	
  ngOnDestroy(): void {
    this.defaultBranch$$.unsubscribe();
  }
}
