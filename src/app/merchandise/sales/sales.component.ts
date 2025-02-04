import { Component, OnInit, OnDestroy } from '@angular/core';
import { MerchandiseListItem } from 'app/model/merchandise-list-item';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataForSelect } from 'app/model/data-for-select';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { MerchandiseService } from '../merchandise.service';
import { map, distinctUntilChanged, debounceTime, filter, tap, switchMapTo } from 'rxjs/operators';
import { UserService } from 'app/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit, OnDestroy {

  products: MerchandiseListItem[];
  branch_id: number;

  state: {
    state: 'list' | 'cart' | 'list-orders';
  }

  placeOrderForm: FormGroup;
  total$$;
  total: number;
  submitted = false;
  branch$: Observable<DataForSelect[]>;
  customer$: Observable<DataForSelect[]>;

  constructor(
    private licenseeService: LicenseeService,
    private userService: UserService,
    private router: Router,
    private merchandiseService: MerchandiseService) { }

  ngOnInit(): void {
    this.branch$ = this.licenseeService.getBranchForSelect();
    this.customer$ = this.userService.listParents();
    this.initializeForm()
    this.initializeState();
    this.totalAmount();
  }

  onSelectBranch(e) {
    if (!e.target.value) {
      return;
    }
    this.getProductList(+e.target.value);
  }

  getProductList(branch_id: number) {
    this.branch_id = branch_id;
    const items = this.placeOrderForm.get('items') as FormArray;
    this.merchandiseService.getAllProducts(branch_id, 1, 999)
    .subscribe(
      data => {
        this.products = data;
        const itemsArray = this.placeOrderForm.get('items') as FormArray;
        this.products.forEach((el, i) => {
          this.addItems();
          items.at(i).get('product_id').setValue(data[i].id)
          // Set validators for maximum items can order
          itemsArray.at(i).setValidators([Validators.max(data[i].stock), Validators.min(0)]);
          itemsArray.at(i).updateValueAndValidity();
        })
      },
      err => {
        console.error(err);
        alert(`unable to fetch product list. ${JSON.stringify(err.error)}`)
      }
    )
  }

  initializeForm() {
    this.placeOrderForm = new FormGroup({
      customer_id: new FormControl('', Validators.required),
      branch_id: new FormControl('', Validators.required),
      billing_address_id: new FormControl(),
      shipping_address_id: new FormControl(),
      request_date: new FormControl(),
      customer_notes: new FormControl(),
      staff_notes: new FormControl(),
      items: new FormArray([])
    })
  }

  addItems() {
    const items = this.placeOrderForm.get('items') as FormArray;
    items.push(new FormGroup({
      product_id: new FormControl(),
      quantity: new FormControl()
    }));
  }

  onRemoveItem(i: number): void {
    const items = this.placeOrderForm.get('items') as FormArray;
    // remove from products
    this.products.splice(i, 1);
    items.removeAt(i);
  }

  onCheckOut() {

    const items = this.placeOrderForm.get('items') as FormArray;
    const arrayToRemove = [];
    items.value.forEach((el, i) => {
      if (el.quantity === null) {
        arrayToRemove.push(i);
      }
    });

    // Cannot checkout if no products are ordered
    if (arrayToRemove.length === items.value.length) {
      alert('You need to select items to checkout')
      this.initializeState();
      return;
    }

    // Remove array from largest to smallest
    arrayToRemove.sort((a, b) => b - a)
    .forEach(el => {
      items.removeAt(el);
      this.products.splice(el, 1)
    })

  }

  totalAmount() {
    let price: number;
    this.total$$ =
    this.placeOrderForm.valueChanges
    .pipe(
      map(order => order.items),
      distinctUntilChanged(),
      debounceTime(200),
      map(items => items.filter(item => !!item.quantity).map(item => {
        price = this.products.find(product => product.id === item.product_id) ?
                +this.products.find(product => product.id === item.product_id).price : 0;
        if (price) {
          return +item.quantity * price
        } else {
          alert(`Cannot find price for product.id ${item.product_id}`)
        }
      })),
      filter(subtotal => subtotal.length > 0),
      map(subtotal => {
        return subtotal.reduce((a, b) => a + b)
      })
    ).subscribe(total => this.total = total)
  }

  // UI States

  initializeState() {
    this.state = {
      state: 'list'
    };
  }
  changeState(state: 'list' | 'cart') {
    if (state === 'cart') {
      this.onCheckOut();
    }
    if (state === 'list') {
      this.branch_id = null;
      this.products = null;
      this.submitted = false;
    }
    this.state.state = state;
  }

  getTodayDate() {
    // returns date in YYYY-MM-dd
    let today: any = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
  }

  onSell() {
    console.log(this.placeOrderForm)
    if (!this.placeOrderForm.valid) {
      this.submitted = true;

      return;
    }


    this.merchandiseService.createSales(this.placeOrderForm.value)
    .subscribe(
      () => {
        alert('Product Sold');
        window.location.reload();
      },
      err => alert(`Unable to place order. ${JSON.stringify(err.error)}`)
    )
  }

  ngOnDestroy() {
    if (this.total$$) {
      this.total$$.unsubscribe();
    }
  }



}
