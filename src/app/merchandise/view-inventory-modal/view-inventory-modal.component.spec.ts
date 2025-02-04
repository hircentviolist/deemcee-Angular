import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInventoryModalComponent } from './view-inventory-modal.component';

describe('ViewInventoryModalComponent', () => {
  let component: ViewInventoryModalComponent;
  let fixture: ComponentFixture<ViewInventoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInventoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInventoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
