import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MerchandiseListItem } from 'app/model/merchandise-list-item';
import { UserService } from 'app/user/user.service';
import { MerchandiseService } from '../merchandise.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesService } from 'app/sales.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take, shareReplay, map } from 'rxjs/operators';
import { Adjustment } from 'app/model/adjustment.model';

@Component({
  selector: 'app-product-add-multiple',
  templateUrl: './product-add-multiple.component.html',
  styleUrls: ['./product-add-multiple.component.css']
})
export class ProductAddMultipleComponent implements OnInit {

  productForm: FormGroup;
  submitted = false;
  branch_id: number;
  productList$: Observable<void | MerchandiseListItem[]>;
  customer_id: number;
  itemArray: FormArray;

  constructor(
    private userService: UserService,
    private merchandiseService: MerchandiseService,
    private route: ActivatedRoute,
    private router: Router,
    private salesService: SalesService,
    private modal: NgbModal
  ) {
    this.branch_id = +route.snapshot.queryParamMap.get('branch_id');
    if (!this.branch_id) {
      this.router.navigate(['../../'], {relativeTo: this.route})
    }
  }

  ngOnInit() {
    this.getProductList();
    this.initializeForm();
  }

  getProductList() {
    this.productList$ =
    this.merchandiseService.getAllProducts(this.branch_id, 1, 9999)
    .pipe(
      map((products: any) => products.data),
      shareReplay()
    )

    this.productList$.subscribe((products: MerchandiseListItem[]) => {
      products.forEach(product => {
        product.name = `${product.name} (Balance: ${product.stock})`;
      })
    })
  }

  initializeForm() {
    this.productForm = new FormGroup({
      type: new FormControl('Add', [Validators.required]),
      items: new FormArray([
        new FormGroup({
          product_id: new FormControl('', Validators.required),
          product_name: new FormControl('', Validators.required),
          quantity: new FormControl('', [Validators.required, Validators.min(1)]),
          reason_id: new FormControl(1, Validators.required)
        })
      ])
    });
    this.itemArray = this.productForm.get('items') as FormArray;
  }

  addItem() {
    this.itemArray.push(
      new FormGroup({
        product_id: new FormControl('', Validators.required),
        product_name: new FormControl('', Validators.required),
        quantity: new FormControl('', [Validators.required, Validators.min(1)]),
        reason_id: new FormControl(1, Validators.required)
      })
    );
    console.log(this.productForm.value)
  }

  removeItem(i: number) {
    if (this.itemArray.value.length < 2) {
      // cannot remove when only one item left
      return;
    }
    this.itemArray.removeAt(i);
  }

  onChangeProduct(e, i: number) {
    console.log(i)
    if (!e.target.value) {
      return;
    }
    // does product matches any products in list ?
    this.productList$
    .pipe(
      take(1),
    ).subscribe(productList => {
      if (!productList) {
        return;
      }
      const product = productList.filter(p => p.name === e.target.value);
      const itemsArray = this.productForm.get('items') as FormArray;
      console.log('product', product);

      if (product.length > 0) {
        itemsArray.at(i).get('product_id').setValue(product[0].id)
      } else {
        itemsArray.at(i).get('product_id').reset();
      }
    })

  }

  onSubmit() {
    if (!this.productForm.valid) {
      this.submitted = true;
      console.log(this.productForm)
      return;
    }
    const items =
    this.productForm.value.items
    .map(item => {
      return {
        product_id: item.product_id,
        quantity: item.quantity,
        reason_id: item.reason_id
      }
    }).filter(item => !!item.product_id && item.quantity > 0 && !!item.reason_id)
    const body: Adjustment = this.productForm.value;
    body.items = items;
    this.merchandiseService.adjustStock(this.branch_id, body)
    .subscribe(resp => {
      alert('Add Bulk Stock Successful');
      this.router.navigate(['../../'], {relativeTo: this.route, queryParams: {branch_id: this.branch_id}})
    }, err => {
      console.error(err);
      alert(`Unable to perform Add Bulk Stock. ${JSON.stringify(err)}`)
    })
  }



}
