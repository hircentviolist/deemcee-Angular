import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRequestOrderModalComponent } from './confirm-request-order-modal.component';

describe('ConfirmRequestOrderModalComponent', () => {
  let component: ConfirmRequestOrderModalComponent;
  let fixture: ComponentFixture<ConfirmRequestOrderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmRequestOrderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRequestOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
