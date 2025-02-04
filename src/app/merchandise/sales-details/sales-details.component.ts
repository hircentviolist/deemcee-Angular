import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MerchandiseService } from '../merchandise.service';
import { Observable } from 'rxjs';
import { OrderGetDto } from 'app/model/order-get-dto';

@Component({
  selector: 'app-sales-details',
  templateUrl: './sales-details.component.html',
  styleUrls: ['./sales-details.component.css']
})
export class SalesDetailsComponent implements OnInit {

  id: number;
  sale$: Observable<OrderGetDto>

  constructor(
    private merchandiseService: MerchandiseService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getSales();
  }

  getSales() {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.sale$ = this.merchandiseService.getOneSale(this.id);
  }

}
