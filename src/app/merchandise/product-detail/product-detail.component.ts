import { Component, OnInit } from '@angular/core';
import { MerchandiseService } from '../merchandise.service';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MerchandiseListItem } from 'app/model/merchandise-list-item';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewInventoryModalComponent } from '../view-inventory-modal/view-inventory-modal.component';
import { Credentials } from 'app/model/credentials';
import { AuthService } from 'app/auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  id: number;
  branch_id: number;
  product: MerchandiseListItem;
  productForm: FormGroup;
  submitted = false;
  cred: Credentials;

  constructor(
    private merchandiseService: MerchandiseService,
    private route: ActivatedRoute,
    private router: Router,
    private modal: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.id = +this.route.snapshot.paramMap.get('id');
    this.branch_id = +this.route.snapshot.queryParamMap.get('branch_id');

    if (!this.branch_id) {
      this.router.navigate(['../../'], {relativeTo: this.route});
    } else {
      this.authService.credential$
      .pipe(
        take(1)
      ).subscribe(cred => this.cred = cred)
      this.initializeForm();
      this.getProducts();
    }

  }

  initializeForm() {
    this.productForm = new FormGroup({
      sale_price: new FormControl(''),
      quantity_per_set: new FormControl('', [Validators.required, Validators.min(1)]),
      price_per_set: new FormControl('', [Validators.required, Validators.min(1)])
    })
  }


  getProducts() {
    this.merchandiseService.getOneProduct(this.id, this.branch_id)
    .subscribe(
      product => {
        this.product = product;
        this.productForm.setValue({
          sale_price: product.sale_price,
          quantity_per_set: product.quantity_per_set,
          price_per_set: product.price_per_set
        })
        console.log(this.productForm.value)
      },
      err => {
        console.error(err);
        alert(JSON.stringify(err.error))
      }
    )
  }

  onSubmit() {
    this.submitted = true;
    if (!this.productForm.valid) {
      return;
    }

    this.merchandiseService.updateProduct(this.id, this.branch_id, this.productForm.value)
    .subscribe(
      resp => {
        alert('Update Product Successful');
        this.router.navigate(['../../'], {relativeTo: this.route, queryParams: {branch_id: this.branch_id}})
      }, err => {
        console.error(err);
        alert('Unable To Update Product ' + JSON.stringify(err))
      }
    )
  }

  onViewInventory(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    const modalRef = this.modal.open(ViewInventoryModalComponent);
    modalRef.componentInstance.product = {
      name: this.product.name,
      id: this.id,
      branch_id: this.product.branch.id
    };
  }


}
