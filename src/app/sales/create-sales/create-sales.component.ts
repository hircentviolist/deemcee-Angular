import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray, Form } from '@angular/forms';
import { Subscription, Observable, noop, EMPTY } from 'rxjs';
import { UserService } from 'app/user/user.service';
import { debounceTime, shareReplay, take, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { MerchandiseService } from 'app/merchandise/merchandise.service';
import { MerchandiseListItem } from 'app/model/merchandise-list-item';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderPostDto } from 'app/model/order-post-dto';
import { SalesService } from 'app/sales.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmCreateSalesModalComponent } from '../confirm-create-sales-modal/confirm-create-sales-modal.component';
import { DataForSelect } from 'app/model/data-for-select';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { DefaultBranchService } from 'app/default-branch.service';
import { PromoCodeService } from 'app/promo-code/promo-code.service';

@Component({
  selector: 'app-create-sales',
  templateUrl: './create-sales.component.html',
  styleUrls: ['./create-sales.component.css']
})
export class CreateSalesComponent implements OnInit, OnDestroy {

  salesForm: FormGroup;
  submited = false;
  email$$: Subscription;
  name$$: Subscription;
  parent$: Observable<DataForSelect[]>;
  branch_id: number;
  productList$: Observable<void | MerchandiseListItem[]>;
  productsState: {
    stock: any[];
    price: string;
    quantity: number;
    subtotal: number;
    is_out_of_stock: boolean;
  }[] = [];
  customer_id: number;
  itemArray: FormArray;

  branch$: Observable<DataForSelect[]>;
  defaultBranch$$: Subscription;

  promoCodes: any;
  promoCodeErrorMessage: string = null;
  selectedPromoCode: any;
  discountAmount = 0;

  constructor(
    private licenseeService: LicenseeService,
    private defaultBranchService: DefaultBranchService,
    private userService: UserService,
    private merchandiseService: MerchandiseService,
    private route: ActivatedRoute,
    private router: Router,
    private salesService: SalesService,
    private promoCodeService: PromoCodeService,
    private modal: NgbModal
  ) {
    // this.branch_id = +route.snapshot.queryParamMap.get('branch_id');
    // if (!this.branch_id) {
    //   this.router.navigate(['../list'], {relativeTo: this.route})
    // }
  }

  ngOnInit(): void {
    this.branch$ = this.branch$ = this.licenseeService.getBranchForSelect();
    this.defaultBranch$$ = this.defaultBranchService.defaultBranch$
      .subscribe(branch_id => {
        if (branch_id) {
          this.branch_id = branch_id;
          this.getParents();
          this.getProductList();
					this.getPromoCodeList();
        }
      });
    this.initializeForm();
    this.listenToEmail();
    this.listenToName();
    this.listenToPromoCodeSearch();
    this.itemArray = this.salesForm.get('items') as FormArray;
  }

	getPromoCodeList() {
    this.promoCodeService.getPromoCodeListBranch(this.branch_id, true, 'merchandise').subscribe(res => {
			this.promoCodes = res;
			console.log(res)
		}, err => {
			alert(err.error.message)
			console.log(err)
		})
	}

  listenToPromoCodeSearch() {
    this.salesForm.get('promo_code').valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(result => {
      if (!result) {
        this.selectedPromoCode = null;
        this.promoCodeErrorMessage = null;
        this.discountAmount = 0;
      } else {
        this.selectedPromoCode = this.promoCodes.find(promo => promo.code.toLowerCase() === result.toLowerCase());

        if (this.selectedPromoCode) {
          if (
            this.selectedPromoCode.min_purchase_amount &&
            +this.subTotal < +this.selectedPromoCode.min_purchase_amount
          ) {
            this.discountAmount = 0;
            this.promoCodeErrorMessage = 'Did not meet minimum purchase: RM' + (+this.selectedPromoCode.min_purchase_amount).toFixed(2);
          } else {
            this.promoCodeErrorMessage = null;
            this.discountAmount = +this.selectedPromoCode.amount;
          }
        } else {
          this.discountAmount = 0;
          this.promoCodeErrorMessage = 'Invalid promo code';
        }
      }
    })
  }

  initializeForm() {
    this.salesForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      promo_code: new FormControl(''),
      items: new FormArray([
        new FormGroup({
          product_id: new FormControl('', Validators.required),
          product_name: new FormControl('', Validators.required),
          quantity: new FormControl('', Validators.required)
        })
      ])
    })
    this.productsState.push({
      stock: [],
      price: '',
      quantity: 0,
      subtotal: 0,
      is_out_of_stock: false
    })
  }

  addItem() {
    this.productsState.push({
      stock: [],
      price: '',
      quantity: 0,
      subtotal: 0,
      is_out_of_stock: false
    })
    this.itemArray.push(
      new FormGroup({
        product_id: new FormControl('', Validators.required),
        product_name: new FormControl('', Validators.required),
        quantity: new FormControl('', Validators.required)
      })
    );
    console.log(this.salesForm.value)
  }

  removeItem(i: number) {
    if (this.itemArray.value.length < 2) {
      // cannot remove when only one item left
      return;
    }
    this.itemArray.removeAt(i);
    this.productsState.splice(i, 1);
  }


  listenToEmail() {
    this.email$$ =
    this.salesForm.get('email').valueChanges
    .pipe(
      debounceTime(250),
      distinctUntilChanged()
    )
    .subscribe(email => {
      if (this.salesForm.get('email').valid) {
        this.email$$ =
        this.userService.getParentsByEmail(email)
        .subscribe(parent => {
          if (!!parent) {
            this.customer_id = parent.id
            this.salesForm.patchValue({
              email: parent.email,
              name: parent.name,
              phone: parent.phone,
            });
          }
        });
      }
    })
  }

  listenToName() {
    this.name$$ =
    this.salesForm.get('name').valueChanges
    .pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(name => {
        if (name) {
          // if name is inside list, autofill form else return EMPTY
          return this.parent$
                  .pipe(
                    switchMap(parents => {
                      const idx = parents.map(p => p.name).indexOf(name);
                      if (idx === -1) {
                        return EMPTY;
                      } else {
                        return this.userService.getOneParent(parents[idx].id)
                      }
                    }),
                    tap(parent => {
                      this.salesForm.get('email').setValue(parent.email);
                      this.salesForm.get('phone').setValue(parent.phone);
                    })
                  )

        } else {
          return EMPTY;
        }
      })
    ).subscribe()

  }

  getProductList() {
    this.productList$ =
    this.merchandiseService.getAllProducts(this.branch_id, 1, 999)
    .pipe(
      map((products: any) => products.data),
      shareReplay()
    )
    this.productList$.subscribe((products: MerchandiseListItem[]) => {
      products.map(product => {
        product.name = `${product.name} (Balance: ${product.stock})`;
        return product;
      })
    })
  }

  getParents() {
    this.parent$ =
    this.userService.listParentMultipleBranch([this.branch_id])
    .pipe(
      map(parents => parents.map(p => {
        return {id: p.id, name: `${p.name} (${p.id})`}
      })),
      shareReplay()
    )
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
      const itemsArray = this.salesForm.get('items') as FormArray;
      console.log('product', product);

      if (product.length > 0) {
        console.log('i', i)
        console.log('productsState', this.productsState)
        this.productsState[i].stock = new Array((+product[0].stock - (+product[0].stock %  +product[0].quantity_per_set))
          / +product[0].quantity_per_set);
        this.productsState[i].price = product[0].price;
        itemsArray.at(i).get('product_id').setValue(product[0].id)
        this.productsState[i].is_out_of_stock = !this.productsState[i].stock.length;
        console.log(this.productsState)
      } else {
        this.productsState[i] = {
          stock: [],
          price: '',
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
    this.productsState[i].subtotal = +this.productsState[i].price * e.target.value;
  }

  onSubmit() {
    this.submited = true;


    // convert product name into product_id
    const items =
    this.salesForm.value.items
    .map(p => {
      return {
        product_id: p.product_id,
        quantity: p.quantity
      }
    }).filter(p => !!p.product_id)
    .filter(p => p.quantity > 0)

    // Create Data to Submit Sales
    const body: OrderPostDto = {
      branch_id: this.branch_id,
      customer_id: this.customer_id,
      promo_code: this.selectedPromoCode ? this.selectedPromoCode.code : null,
      items
    }

    // Creating Data for Confirm Modal
    const confirm = {
      total: this.total,
      promo: this.selectedPromoCode,
      items: []
    }

    this.salesForm.value.items.forEach((element, i) => {
      confirm.items.push({
        product_name: element.product_name,
        quantity: element.quantity,
        subtotal: this.productsState[i].subtotal
      })
    });

    const modalRef = this.modal.open(ConfirmCreateSalesModalComponent);
    modalRef.componentInstance.confirm = confirm;
    modalRef.result
    .then(r => noop, dismiss => {
      if (dismiss) {
        this.salesService.createSales(body)
        .subscribe(data => {
          alert('Sales Order Placed');
          this.router.navigate(['../list'], {relativeTo: this.route, queryParams: {branch_id: this.branch_id}})
        }, err => {
          alert(JSON.stringify(err.error))
          console.error(err)
        })
      } else {
        alert('Sales Not Created')
      }
    })
  }

  get total(): number {
    const total = this.subTotal - this.discountAmount;

    return total < 0 ? 0 : total;
  }

  get subTotal(): number {
    return this.productsState.map(p => p.subtotal).reduce((a, b) => a + b);
  }

  ngOnDestroy() {
    if (this.email$$) {
      this.email$$.unsubscribe();
    }
    if (this.name$$) {
      this.name$$.unsubscribe()
    }
  }

}
