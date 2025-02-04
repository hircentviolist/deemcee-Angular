import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseDPointComponent } from './purchase-d-point.component';

describe('PurchaseDPointComponent', () => {
  let component: PurchaseDPointComponent;
  let fixture: ComponentFixture<PurchaseDPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseDPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseDPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
