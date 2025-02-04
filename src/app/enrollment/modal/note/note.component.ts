import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {EnrollmentService} from '../../../enrollment.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  @Input() data: any;
  notes = '';
  constructor(
    public activeModal: NgbActiveModal,
    private enrollmentService: EnrollmentService
  ) { }

  ngOnInit(): void {
    this.notes = this.data.remark;
  }

  save() {
    this.enrollmentService.updateStudentNotes(this.data.id, {remark: this.notes}).subscribe(resp => {
      this.activeModal.close(resp);
    }, err => {
      console.log(err)
      alert(err.error.message)
    });
  }

}
