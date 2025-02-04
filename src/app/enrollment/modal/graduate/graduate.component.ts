import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {EnrollmentListItem} from '../../../model/enrollment-list-item';

@Component({
  selector: 'app-graduate',
  templateUrl: './graduate.component.html',
  styleUrls: ['./graduate.component.css']
})
export class GraduateComponent implements OnInit {

  @Input() data: {enrolment: EnrollmentListItem};

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  graduate() {
    this.activeModal.close(true);
  }

}
