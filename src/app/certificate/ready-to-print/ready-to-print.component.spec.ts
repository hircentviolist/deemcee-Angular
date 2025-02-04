import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyToPrintComponent } from './ready-to-print.component';

describe('ReadyToPrintComponent', () => {
  let component: ReadyToPrintComponent;
  let fixture: ComponentFixture<ReadyToPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadyToPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadyToPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
