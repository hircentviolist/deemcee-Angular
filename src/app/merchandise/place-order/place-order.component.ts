import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray, Form } from '@angular/forms';
import { Subscription, Observable, noop, EMPTY } from 'rxjs';
import { UserService } from 'app/user/user.service';
import { debounceTime, shareReplay, take, distinctUntilChanged, filter, map, switchMap, switchMapTo } from 'rxjs/operators';
import { MerchandiseService } from 'app/merchandise/merchandise.service';
import { MerchandiseListItem } from 'app/model/merchandise-list-item';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderPostDto } from 'app/model/order-post-dto';
import { SalesService } from 'app/sales.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmCreateSalesModalComponent } from 'app/sales/confirm-create-sales-modal/confirm-create-sales-modal.component';
import { DataForSelect } from 'app/model/data-for-select';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { StockRequestPost } from 'app/model/stock-request-post';
import { ConfirmRequestOrderModalComponent } from '../confirm-request-order-modal/confirm-request-order-modal.component';
import { DefaultBranchService } from 'app/default-branch.service';
import { AuthService } from 'app/auth/auth.service';


@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit, OnDestroy {

  orderForm: FormGroup;
  submited = false;
  email$$: Subscription;
  branch$: Observable<DataForSelect[]>
  branch_id: number;
  productList$: Observable<void | MerchandiseListItem[]>;
  productsState: {
    stock: any[];
    quantity_per_set: number;
    price_per_set: number;
    quantity: number;
    subtotal: number;
    is_out_of_stock: boolean;
  }[] = [];
  total = 0;
  customer_id: number;
  itemArray: FormArray;
  branch$$: Subscription;

  constructor(
    private userService: UserService,
    private licenseeService: LicenseeService,
    private merchandiseService: MerchandiseService,
    private route: ActivatedRoute,
    private router: Router,
    private modal: NgbModal,
    private defaultBranchService: DefaultBranchService,
    private authService: AuthService
  ) {
    // this.branch_id = +route.snapshot.queryParamMap.get('branch_id');
  }

  ngOnInit(): void {
    this.initializeForm();
    this.branch$ = this.licenseeService.getBranchForSelect();
    this.itemArray = this.orderForm.get('items') as FormArray;

    this.branch$ =
    this.authService.credential$
    .pipe(
      switchMap(cred => {
        if (cred.role === 'admin' || cred.role === 'superadmin') {
          return this.licenseeService.getAdminBranchForSelect()
        } else {
          return this.licenseeService.getBranchForSelect()
        }
      })
    )

    this.branch$$ =
    this.defaultBranchService.defaultBranch$
    .subscribe(branch_id => this.branch_id = branch_id)

    this.getProductList();

  }

  onSelectBranch(e) {
    if (!e.target.value) {
      return;
    }
    this.branch_id = +e.target.value;
    this.orderForm.get('branch_id').patchValue(this.branch_id);
    this.getProductList();
  }

  initializeForm() {
    this.orderForm = new FormGroup({
      branch_id: new FormControl('', Validators.required),
      delivery_method: new FormControl('', Validators.required),
      delivery_address: new FormControl(''),
      customer_notes: new FormControl(''),
      items: new FormArray([
        new FormGroup({
          product_id: new FormControl('', Validators.required),
          product_name: new FormControl('', Validators.required),
          no_of_sets: new FormControl('', Validators.required)
        })
      ])
    })
    this.productsState.push({
      stock: [],
      quantity_per_set: 0,
      price_per_set: 0,
      quantity: 0,
      subtotal: 0,
      is_out_of_stock: false
    })
  }

  addItem() {
    this.productsState.push({
      stock: [],
      quantity_per_set: 0,
      price_per_set: 0,
      quantity: 0,
      subtotal: 0,
      is_out_of_stock: false
    })
    this.itemArray.push(
      new FormGroup({
        product_id: new FormControl('', Validators.required),
        product_name: new FormControl('', Validators.required),
        no_of_sets: new FormControl('', Validators.required)
      })
    );
    console.log(this.orderForm.value)
  }

  removeItem(i: number) {
    if (this.itemArray.value.length < 2) {
      // cannot remove when only one item left
      return;
    }
    this.itemArray.removeAt(i);
    this.productsState.splice(i, 1);
    this.total = this.productsState.map(p => p.subtotal).reduce((a, b) => a + b);
  }

  getProductList() {
    // getAllProducts(1) -> branch_id always set to 1 because ordering from hq
    this.productList$ =
    this.merchandiseService.getAllProducts(1, 1, 999)
    .pipe(
      map((products: any) => products.data), shareReplay()
    )
    this.productList$.subscribe((products: MerchandiseListItem[]) => {
      products.map(p => {
        p.name = `${p.name} (My Balance: ${p.branch_stock})`
        return p;
      })
    })
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
      const itemsArray = this.orderForm.get('items') as FormArray;
      console.log('product', product);

      if (product.length > 0) {
        console.log('i', i)
        console.log('productsState', this.productsState)
        this.productsState[i].stock = new Array((+product[0].stock - (+product[0].stock %  +product[0].quantity_per_set))
        / +product[0].quantity_per_set);
        this.productsState[i].quantity_per_set = product[0].quantity_per_set;
        this.productsState[i].price_per_set = product[0].price_per_set;
        this.productsState[i].subtotal = 0;
        this.productsState[i].is_out_of_stock = !this.productsState[i].stock.length;
        itemsArray.at(i).get('product_id').setValue(product[0].id)
        console.log(this.productsState)
      } else {
        this.productsState[i] = {
          stock: [],
          quantity_per_set: 0,
          price_per_set: 0,
          quantity: 0,
          subtotal: 0,
          is_out_of_stock: true
        }
      }
    })

  }

  onChangeQuantity(e, i: number) {
    if (!e.target.value) {
      return;
    }
    this.productsState[i].subtotal = +this.productsState[i].price_per_set * e.target.value;
    this.total = this.productsState.map(p => p.subtotal).reduce((a, b) => a + b);
  }

  onSubmit() {
    console.log(this.orderForm);
    if (!this.orderForm.valid) {
      this.submited = true;
    }

    console.log(this.orderForm);

    // convert product name into product_id
    const items =
    this.orderForm.value.items
    .map(p => {
      return {
        product_id: p.product_id,
        no_of_sets: p.no_of_sets
      }
    })

    // Create Data to Submit Sales
    const body: StockRequestPost = {
      branch_id: this.branch_id,
      delivery_type: this.orderForm.get('delivery_method').value,
      delivery_address: this.orderForm.get('delivery_address').value,
      customer_notes: this.orderForm.get('customer_notes').value,
      staff_notes: null,
      items: items
    }

    const check = this.validateBody(body);
    if (!check.valid) {
      return alert(check.message);
    }

    // Creating Data for Confirm Modal
    const confirm = {
      total: this.total,
      items: []
    }

    this.orderForm.value.items.forEach((element, i) => {
      confirm.items.push({
        product_name: element.product_name,
        quantity: element.no_of_sets,
        subtotal: this.productsState[i].subtotal
      })
    });

    console.log('confirm', confirm)

    const modalRef = this.modal.open(ConfirmRequestOrderModalComponent);
    modalRef.componentInstance.confirm = confirm;
    modalRef.result
    .then(r => noop, dismiss => {
      if (dismiss) {
        this.merchandiseService.addOrder(body)
        .subscribe(data => {
          alert('Order Request Placed');
          this.orderForm.reset();
          location.reload();
        }, err => {
          alert(err.error.message)
          console.error(err)
        })
      } else {
        //
      }
    })
  }

  validateBody(body): {valid: boolean, message: string} {
    const value = {
      valid: true,
      message: ''
    }

    body.items.some((item, i) => {
      if (!item.no_of_sets) {
        value.valid = false;
        value.message = 'Please choose Number of Set for item #' + (i + 1);
      }
      if (!item.product_id) {
        value.valid = false;
        value.message = 'Please choose Product';
      }
      return !item.product_id || !item.no_of_sets
    });

    if (!body.delivery_type) {
      value.valid = false;
      value.message = 'Please choose Self-Pickup or Delivery';
    } else if (body.delivery_type && body.delivery_type === 'Deliver To' && !body.delivery_address) {
      value.valid = false;
      value.message = 'Please provide delivery address';
    }

    return value;
  }

  ngOnDestroy() {
    if (this.email$$) {
      this.email$$.unsubscribe();
    }
    if (this.branch$$) {
      this.branch$$.unsubscribe();
    }
  }

}
