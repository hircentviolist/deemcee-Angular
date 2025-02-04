import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSalesModalComponent } from './view-sales-modal.component';

describe('ViewSalesModalComponent', () => {
  let component: ViewSalesModalComponent;
  let fixture: ComponentFixture<ViewSalesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSalesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSalesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
