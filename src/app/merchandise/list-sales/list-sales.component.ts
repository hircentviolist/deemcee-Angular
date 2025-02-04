import { Component, OnInit } from '@angular/core';
import { MerchandiseService } from '../merchandise.service';
import { Observable } from 'rxjs';
import { DataForSelect } from 'app/model/data-for-select';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { OrderListItem } from 'app/model/order-list-item';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-list-sales',
  templateUrl: './list-sales.component.html',
  styleUrls: ['./list-sales.component.css']
})
export class ListSalesComponent implements OnInit {

  branch$: Observable<DataForSelect[]>;
  sale$: Observable<OrderListItem[]>;

  constructor(private merchandiseService: MerchandiseService, private licenseeService: LicenseeService) { }

  ngOnInit(): void {
    this.branch$ = this.licenseeService.getBranchForSelect();
  }

  onSelectBranch(e) {
    if (!e.target.value) {
      return;
    }
    this.sale$ =
    this.merchandiseService.getAllSales()
    .pipe(
      map(sales => sales.filter(s => s.branch.id === +e.target.value))
    )
  }

}
