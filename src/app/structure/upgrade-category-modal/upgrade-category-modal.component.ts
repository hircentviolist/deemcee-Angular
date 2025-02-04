import { Component, OnInit, Input } from '@angular/core';
import { CategoryDetail } from 'app/model/category-detail.dto';
import { Observable } from 'rxjs';
import { MONTHS } from '../../resource/months';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StructureService } from '../structure.service';

@Component({
  selector: 'app-upgrade-category-modal',
  templateUrl: './upgrade-category-modal.component.html',
  styleUrls: ['./upgrade-category-modal.component.css']
})
export class UpgradeCategoryModalComponent implements OnInit {

  @Input() categoryDetail$: Observable<CategoryDetail>;
  months = MONTHS;
  years = [];
  upgradeForm: FormGroup;
  startMonth: string;
  monthsName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  categoryDetail: CategoryDetail;
  nextVersion: number;

  constructor(
    private structureService: StructureService,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initializeForm();
    this.categoryDetail$.subscribe(resp => {
      this.categoryDetail = resp;
      this.nextVersion = Math.max(...resp.versions.map(v => +v.name)) + 1;
      this.createYear();
    this.createStartDate();
    });
  }

  initializeForm() {
    this.upgradeForm = new FormGroup({
      category_id: new FormControl(''),
      start_month: new FormControl('', Validators.required),
      start_year: new FormControl('', Validators.required),
      end_month: new FormControl('', Validators.required),
      end_year: new FormControl('', Validators.required),
    })
  }

  createStartDate() {
      const last = this.categoryDetail.versions.map(v => v.end_date).pop().split('-');
      console.log('last', last)
      const month = this.monthsName[+last[1]] ? this.monthsName[+last[1]] : 'January';
      const year = this.monthsName[+last[1]] ? last[0] : (+last[0] + 1);
      this.startMonth = `${month} ${year}`;

      // Populate Form start_month, start_year, end_month, end_year
      this.upgradeForm.get('start_month').setValue(
        last[1] === '12' ? '1' : (+last[1] + 1)
      )
      this.upgradeForm.get('start_year').setValue(
        last[1] === '12' ? (+last[0] + 1).toString() : last[0]
      )
      this.upgradeForm.get('end_month').setValue(
        last[1] === '2' ? '11' : +last[1]
      )
      this.upgradeForm.get('end_year').setValue(
        last[1] === '12' ? (+last[0] + 1 + 3).toString() : (+last[0] + 3)
      )
      this.upgradeForm.get('category_id').setValue(this.categoryDetail.id)
      console.log(this.upgradeForm)


  }

  createYear() {
    const last = this.categoryDetail.versions.map(v => v.end_date).pop().split('-');
    const year = this.monthsName[+last[1]] ? last[0] : (+last[0] + 1);

    for (let i = 0; i < 10; i++) {
      this.years.push((+year + i))
    }
  }

  lastDayOfMonth(): string {
    switch (this.upgradeForm.value.end_month) {
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

  onSubmit() {
    // Remap Input
    const body = {
      category_id: this.upgradeForm.value.category_id,
      start_date: `${this.upgradeForm.value.start_year}-${('0' + this.upgradeForm.value.start_month).slice(-2)}-01`,
      end_date: `${this.upgradeForm.value.end_year}-${('0' + this.upgradeForm.value.end_month).toString().slice(-2)}-${this.lastDayOfMonth()}`,
    }

    // Submit to API
    this.structureService.addCategoryVersion(body)
    .subscribe(
      () => {
        alert('New Version Created');
        this.activeModal.close(true);
      }, err => {
        alert(`Failed to create new version. ${JSON.stringify(err)}`);
        console.error(err)
      }
    )
  }

}
