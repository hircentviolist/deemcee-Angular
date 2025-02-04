import { Component, OnInit, Input } from '@angular/core';
import { MerchandiseService } from '../merchandise.service';
import { Observable } from 'rxjs';
import { InventoryGetDto } from 'app/model/inventory-get-dto';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdjustInventoryModalComponent } from '../adjust-inventory-modal/adjust-inventory-modal.component';
import { StockMovementModalComponent } from '../stock-movement-modal/stock-movement-modal.component';
import { AuthService } from 'app/auth/auth.service';
import { Credentials } from 'app/model/credentials';
import { take, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-view-inventory-modal',
  templateUrl: './view-inventory-modal.component.html',
  styleUrls: ['./view-inventory-modal.component.css']
})
export class ViewInventoryModalComponent implements OnInit {

  @Input() product: {name: string; id: number; branch_id: number; };
  inventory$: Observable<InventoryGetDto[]>;
  cred: Credentials;

  constructor(
    private activeModal: NgbActiveModal,
    private modal: NgbModal,
    private authService: AuthService,
    private merchandiseService: MerchandiseService) {
    }

  ngOnInit(): void {
    this.getInventory();
  }

  getInventory() {
    this.inventory$ =
    this.authService.credential$
    .pipe(
      take(1),
      switchMap(cred => {
        if (cred.role === 'admin' || cred.role === 'superadmin') {
          return this.merchandiseService.getInventoryByProductId(this.product.id)
        } else {
          return this.merchandiseService.getInventoryByProductId(this.product.id)
                  .pipe(
                    map(inventories => inventories.filter(i => i.branch.id === this.product.branch_id))
                  )
        }
      })
    );
  }

  onClose() {
    this.activeModal.close();
  }

  onAdjustInventory() {
    const modalRef = this.modal.open(AdjustInventoryModalComponent);
    modalRef.componentInstance.product = this.product;
    modalRef.result.then(() => this.getInventory())
  }

  onViewMovement(branch_id: number, product) {
    const modalRef = this.modal.open(StockMovementModalComponent);
    modalRef.componentInstance.product = this.product;
    modalRef.componentInstance.branch_id = branch_id;
  }

}
