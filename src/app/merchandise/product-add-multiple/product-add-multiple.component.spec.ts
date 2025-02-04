import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddMultipleComponent } from './product-add-multiple.component';

describe('ProductAddMultipleComponent', () => {
  let component: ProductAddMultipleComponent;
  let fixture: ComponentFixture<ProductAddMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAddMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
