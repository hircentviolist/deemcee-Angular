import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {EnrollmentListItem} from '../../../model/enrollment-list-item';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  @Input() data: {student: EnrollmentListItem};

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log('DeleteComponent: ', this.data.student);
  }

  onSubmit() {
    this.activeModal.close(this.data.student.id);
  }
}
