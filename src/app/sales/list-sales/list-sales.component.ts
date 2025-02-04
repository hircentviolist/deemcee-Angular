import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewSalesModalComponent } from '../view-sales-modal/view-sales-modal.component';
import { SalesService } from 'app/sales.service';
import { Observable, Subscription } from 'rxjs';
import { DataForSelect } from 'app/model/data-for-select';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { OrderListItem } from 'app/model/order-list-item';
import { ActivatedRoute } from '@angular/router';
import { DefaultBranchService } from 'app/default-branch.service';
import { TitleService } from 'app/shared/title.service';

@Component({
  selector: 'app-list-sales',
  templateUrl: './list-sales.component.html',
  styleUrls: ['./list-sales.component.css']
})
export class ListSalesComponent implements OnInit, OnDestroy {

  branch$: Observable<DataForSelect[]>;
  sale$: Observable<OrderListItem[]>;
  branch_id: number;
  defaultBranch$$: Subscription;

  constructor(
    private modalService: NgbModal,
    private licenseeService: LicenseeService,
    private salesService: SalesService,
    private route: ActivatedRoute,
    private defaultBranchService: DefaultBranchService,
    private titleService: TitleService,
  ) {
    this.titleService.postTitle('Merchandise Sales')
  }

  ngOnInit(): void {
    this.branch$ = this.licenseeService.getBranchForSelect();

    this.defaultBranch$$ =
    this.defaultBranchService.defaultBranch$
    .subscribe(branch_id => {
      if (branch_id) {
        this.branch_id = branch_id;
        this.getSales()
      }
    })
  }

  onSelectBranch(e) {
    if (!e.target.value) {
      return;
    }
    this.branch_id = +e.target.value;
    this.getSales();
  }

  getSales() {
    this.sale$ =
    this.salesService.getAllSales(this.branch_id);
  }

  onView(order_number: number) {
    const modalRef = this.modalService.open(ViewSalesModalComponent);
    modalRef.componentInstance.sale$ = this.salesService.getOneSale(order_number);
  }

  ngOnDestroy() {
    this.defaultBranch$$.unsubscribe()
  }

  formatTime (date) {
    return date?.substring(0, 10);
  }

}
