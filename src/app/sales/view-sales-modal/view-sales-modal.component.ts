import { Component, OnInit, Input } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { OrderGetDto } from 'app/model/order-get-dto';
import { map } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-sales-modal',
  templateUrl: './view-sales-modal.component.html',
  styleUrls: ['./view-sales-modal.component.css']
})
export class ViewSalesModalComponent implements OnInit {

  @Input() sale$: Observable<OrderGetDto>;
  sale: OrderGetDto;
  total: number;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.sale$.subscribe(sale => {
      this.sale = sale;
      this.total = sale.items.map(s => +s.subtotal).reduce((a, b) => a + b);
    })
  }

}
