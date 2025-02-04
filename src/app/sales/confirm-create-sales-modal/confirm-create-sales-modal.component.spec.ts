import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCreateSalesModalComponent } from './confirm-create-sales-modal.component';

describe('ConfirmCreateSalesModalComponent', () => {
  let component: ConfirmCreateSalesModalComponent;
  let fixture: ComponentFixture<ConfirmCreateSalesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmCreateSalesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCreateSalesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
