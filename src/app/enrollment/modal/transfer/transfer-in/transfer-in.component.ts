import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EnrollmentService} from '../../../../enrollment.service';
import {LicenseeService} from '../../../../hq/licensee/licensee.service';
import {Observable} from 'rxjs';
import {BranchListDto} from '../../../../model/branch-list-dto';
import {shareReplay, take, tap} from 'rxjs/operators';
import {TransferInDetailsComponent} from '../transfer-in-details/transfer-in-details.component';
import {DefaultBranchService} from '../../../../default-branch.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-transfer-in',
  templateUrl: './transfer-in.component.html',
  styleUrls: ['./transfer-in.component.css']
})
export class TransferInComponent implements OnInit {
  @Input() data: {branch_id: number};
  studentList = [];
  branch$: Observable<BranchListDto[]>;

  constructor(
    public activeModal: NgbActiveModal,
    private enrollmentService: EnrollmentService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.enrollmentService.getTransferInList(this.data.branch_id).subscribe(
      studentList => {
        studentList.map(student => {
          if (student.status === 'pending') {
            this.studentList.push(student);
          }
        });
      }
    )
  }

  onTransferIn(student) {
    const modalRef = this.modalService.open(TransferInDetailsComponent);
    modalRef.componentInstance.data = {student};
    modalRef.result.then(resp => {
      this.enrollmentService.transferIn(this.data.branch_id, student.student_id, resp).subscribe(
        res => {
          this.activeModal.close(res);
          alert(`${student.student.first_name} has been successfully transferred.`)
        }, (err: HttpErrorResponse) => {
          alert(err.error.message)
          console.log(err.error)
        }
      )
    }, err => {})
  }
}
