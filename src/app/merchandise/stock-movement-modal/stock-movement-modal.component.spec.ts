import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMovementModalComponent } from './stock-movement-modal.component';

describe('StockMovementModalComponent', () => {
  let component: StockMovementModalComponent;
  let fixture: ComponentFixture<StockMovementModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockMovementModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockMovementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
