import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-request-order-modal',
  templateUrl: './confirm-request-order-modal.component.html',
  styleUrls: ['./confirm-request-order-modal.component.css']
})
export class ConfirmRequestOrderModalComponent implements OnInit {

  @Input() confirm: {
    total: number;
    items: {product_name: string, quantity: number, subtotal: number}[]
  }

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log('confirm', this.confirm);
  }
}
