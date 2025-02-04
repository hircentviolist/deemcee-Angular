import { Component, OnInit } from '@angular/core';
import { StockRequestGet } from 'app/model/stock-request-get';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'app/auth/auth.service';
import { take } from 'rxjs/operators';
import { MerchandiseService } from '../merchandise.service';
import { ActivatedRoute } from '@angular/router';
import { StockRequestPatchStatus } from 'app/model/stock-request-patch-status';
import { Location } from '@angular/common';

@Component({
  selector: 'app-show-order',
  templateUrl: './show-order.component.html',
  styleUrls: ['./show-order.component.css']
})
export class ShowOrderComponent implements OnInit {

  order: StockRequestGet;
  total = 0;
  orderForm: FormGroup;
  deliveryFeesForm: FormGroup;
  submitted = false;
  id: number;
  role: string;

  constructor(
    private authService: AuthService,
    private merchandiseService: MerchandiseService,
    public location: Location,
    private route: ActivatedRoute
  ) {
    authService.credential$
    .pipe(
      take(1)
    ).subscribe(cred => this.role = cred.role)

    this.id = +route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.initializeForm();
    this.populateForm();
  }

  initializeForm() {
    this.orderForm = new FormGroup({
      staff_notes: new FormControl(''),
    });
    this.deliveryFeesForm = new FormGroup({
      delivery_fee: new FormControl('')
    })
  }

  populateForm() {

    this.merchandiseService.getOneOrder(this.id)
    .subscribe(
      data => {
        this.order = data;
        this.orderForm.setValue({
          staff_notes: data.staff_notes || ''
        });
        this.deliveryFeesForm.setValue({
          delivery_fee: data.delivery_fee || ''
        });
        this.total =
        +data.items.map(item => +item.subtotal).reduce((a, b) => a + b) + +this.order.delivery_fee;

      }
    )
  }


  onSubmitStaffNotes() {
    const body: StockRequestPatchStatus = {
      status: 'Pending',
      delivery_fee: +this.order.delivery_fee,
      customer_notes: this.order.customer_notes,
      staff_notes: this.orderForm.value.staff_notes,
    }

    this.merchandiseService.updateOrderStatus(this.id, body)
    .subscribe(
      () => {
        this.populateForm()
      }
    )
  }

  onSubmitDeliveryFees() {
    const body: StockRequestPatchStatus = {
      status: 'Pending',
      delivery_fee: this.deliveryFeesForm.value.delivery_fee.toString(),
      customer_notes: this.order.customer_notes,
      staff_notes: this.orderForm.value.staff_notes
    }

    console.log('body', body)

    this.merchandiseService.updateOrderStatus(this.id, body)
    .subscribe(
      () => {
        this.populateForm()
      }
    )
  }

  updateRequestStatus(status: 'Approved' | 'Delivering' | 'Rejected' | 'Received') {
    const body: StockRequestPatchStatus = {
      status: status,
      customer_notes: this.order.customer_notes,
      staff_notes: this.orderForm.value.staff_notes,
      delivery_fee: +this.deliveryFeesForm.value.delivery_fee
    }
    this.merchandiseService.updateOrderStatus(this.id, body)
    .subscribe(
      () => {
        this.populateForm()
      }, err => console.error(JSON.stringify(err.error))
    )
  }

  onDelete(id: number) {
  }





}
