import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintedComponent } from './printed.component';

describe('PrintedComponent', () => {
  let component: PrintedComponent;
  let fixture: ComponentFixture<PrintedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
