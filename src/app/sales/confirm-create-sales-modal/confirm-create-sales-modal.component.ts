import { Component, OnInit, Input } from '@angular/core';
import { OrderPostDto } from 'app/model/order-post-dto';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-create-sales-modal',
  templateUrl: './confirm-create-sales-modal.component.html',
  styleUrls: ['./confirm-create-sales-modal.component.css']
})
export class ConfirmCreateSalesModalComponent implements OnInit {

  @Input() confirm: {
    total: number;
    promo: {code: string, amount: number};
    items: {product_name: string, quantity: number, subtotal: number}[]
  }

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log('confirm', this.confirm);
  }


}
