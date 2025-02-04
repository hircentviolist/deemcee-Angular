import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {EnrollmentListItem} from '../../../model/enrollment-list-item';

@Component({
  selector: 'app-dropout',
  templateUrl: './dropout.component.html',
  styleUrls: ['./dropout.component.css']
})
export class DropoutComponent implements OnInit {

  @Input() data: {enrolment: EnrollmentListItem};

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  dropout() {
    this.activeModal.close(true);
  }

}
