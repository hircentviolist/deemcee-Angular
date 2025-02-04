import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentsTransactionComponent } from './parents-transaction.component';

describe('ParentsTransactionComponent', () => {
  let component: ParentsTransactionComponent;
  let fixture: ComponentFixture<ParentsTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentsTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentsTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
