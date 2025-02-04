import { Component, OnInit, Input } from '@angular/core';
import { CategoryDetail } from 'app/model/category-detail.dto';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-category-modal',
  templateUrl: './view-category-modal.component.html',
  styleUrls: ['./view-category-modal.component.css']
})
export class ViewCategoryModalComponent implements OnInit {

  @Input() categoryDetail$: Observable<CategoryDetail>;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
