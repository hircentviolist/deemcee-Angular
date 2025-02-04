import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Movement } from 'app/model/movement';
import { MerchandiseService } from '../merchandise.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataForSelect } from 'app/model/data-for-select';
import { shareReplay, map } from 'rxjs/operators';
import { LicenseeService } from 'app/hq/licensee/licensee.service';

@Component({
  selector: 'app-stock-movement-modal',
  templateUrl: './stock-movement-modal.component.html',
  styleUrls: ['./stock-movement-modal.component.css']
})
export class StockMovementModalComponent implements OnInit {

  @Input() product: {name: string; id: number; branch_id: number;};
  @Input() branch_id: number;
  movement$: Observable<Movement>;
  reason$: Observable<DataForSelect[]>;
  branch$: Observable<DataForSelect[]>;

  constructor(
    private merchandiseService: MerchandiseService,
    public activeModal: NgbActiveModal,
    private licenseeService: LicenseeService
  ) { }

  ngOnInit(): void {
    this.movement$ = this.merchandiseService.stockMovement(this.branch_id, this.product.id);
    this.reason$ =
    this.merchandiseService.listReasons()
    .pipe(
      shareReplay()
    )
    this.branch$ =
    this.licenseeService.getBranchForSelect()
    .pipe(
      shareReplay()
    )

  }

  getReasonName(id: number): Observable<string> {
    return this.reason$
            .pipe(
              map(reasons => reasons.filter(r => r.id === id)[0]['name'])
            );
  }

  getBranchName(id: number): Observable<string> {
    return this.branch$
            .pipe(
              map(branches => branches.filter(b => b.id === id)[0]['name'])
            );
  }

}
