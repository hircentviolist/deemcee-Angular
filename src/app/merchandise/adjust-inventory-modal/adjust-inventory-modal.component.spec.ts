import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustInventoryModalComponent } from './adjust-inventory-modal.component';

describe('AdjustInventoryModalComponent', () => {
  let component: AdjustInventoryModalComponent;
  let fixture: ComponentFixture<AdjustInventoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustInventoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustInventoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
