import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { CategoryDetail } from 'app/model/category-detail.dto';
import { switchMap } from 'rxjs/operators';
import { StructureService } from '../structure.service';

@Component({
  selector: 'app-extend-category-modal',
  templateUrl: './extend-category-modal.component.html',
  styleUrls: ['./extend-category-modal.component.css']
})
export class ExtendCategoryModalComponent implements OnInit {

  submitted = false;
  extendForm: FormGroup;
  months = new Array(3);
  id: number;
  @Input() categoryDetail$: Observable<CategoryDetail>;

  constructor(
    private structureService: StructureService,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm () {
    this.extendForm = new FormGroup({
      extension: new FormControl('', Validators.required)
    })
  }

  onSubmit() {
    if (!this.extendForm.valid) {
      this.submitted = true;
      return;
    }

    this.categoryDetail$
    .pipe(
      switchMap(categoryDetail => this.structureService.extendCategoryVersion(
        categoryDetail.id,
        {end_date: this.getExtendedDate(categoryDetail.current_version.end_date)}
      ))
    ).subscribe(() => {
      alert('Extension Successful');
      this.activeModal.close(true)
    }, err => {
      console.error(err);
      alert(`Unable to Extend. ${JSON.stringify(err)}`)
    })
  }

  private getExtendedDate(endDate: string): string {
    let year = +endDate.split('-')[0];
    let month = +endDate.split('-')[1];

    month = month + +this.extendForm.get('extension').value;
    if (+month > 12) {
      month = month - 12
      year = year + 1;
    }

    return `${year}-${('0' + month).toString().slice(-2)}-${this.lastDayOfMonth(month)}`;
  }

  private lastDayOfMonth(month: number): string {
    switch (month) {
      case 1:
        return '31'

      case 2:
        return '28'

      case 3:
        return '31'

      case 4:
        return '30'

      case 5:
        return '31'

      case 6:
        return '30'

      case 7:
        return '31'

      case 8:
        return '31'

      case 9:
        return '30'

      case 10:
        return '31'

      case 11:
        return '30'

      case 12:
        return '31'
    }
  }

}
