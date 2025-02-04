import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferInDetailsComponent } from './transfer-in-details.component';

describe('TransferInDetailsComponent', () => {
  let component: TransferInDetailsComponent;
  let fixture: ComponentFixture<TransferInDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferInDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferInDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
