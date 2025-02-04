import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { DataForSelect } from 'app/model/data-for-select';
import { MerchandiseService } from '../merchandise.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-adjust-inventory-modal',
  templateUrl: './adjust-inventory-modal.component.html',
  styleUrls: ['./adjust-inventory-modal.component.css']
})
export class AdjustInventoryModalComponent implements OnInit {

  @Input() product: {name: string; id: number; branch_id: number; };
  reason$: Observable<DataForSelect[]>;
  adjustmentForm: FormGroup;
  submitted = false;
  itemArray: FormArray;
  isLoading: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private merchandiseService: MerchandiseService
  ) { }

  ngOnInit(): void {
    this.reason$ = this.merchandiseService.listReasons();
    this.initializeForm();
  }

  initializeForm() {
    this.adjustmentForm = new FormGroup({
      type: new FormControl('', Validators.required),
      items: new FormArray([
        new FormGroup({
          product_id: new FormControl(''),
          quantity: new FormControl('', Validators.required),
          reason_id: new FormControl('', Validators.required),
          reason_text: new FormControl('')
        })
      ])
    });

    // Assign initial value
    this.adjustmentForm.get('type').patchValue('Add');
    this.itemArray = this.adjustmentForm.get('items') as FormArray;
    this.itemArray.at(0).get('product_id').patchValue(this.product.id);
  }

  onSubmit() {
    if (this.isLoading) {
      return;
    }
    
    if (!this.adjustmentForm.valid) {
      this.submitted = true;
      return;
    }

    // if reason_id = 7, Require Reason
    this.isLoading = true;
    this.merchandiseService.adjustStock(this.product.branch_id, this.adjustmentForm.value)
    .subscribe(
      () => {
        alert('Adjustment Successful')
        this.activeModal.close();
        this.isLoading = false;
      }, err => {
        console.error(err);
        alert(`Adjustment Failed. ${JSON.stringify(err)}`)
        this.isLoading = false;
      })

  }

  onClickType(type: 'Add' | 'Remove') {
    this.adjustmentForm.get('type').patchValue(type);
  }

}
