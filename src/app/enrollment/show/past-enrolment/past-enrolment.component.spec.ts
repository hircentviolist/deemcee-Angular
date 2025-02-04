import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastEnrolmentComponent } from './past-enrolment.component';

describe('PastEnrolmentComponent', () => {
  let component: PastEnrolmentComponent;
  let fixture: ComponentFixture<PastEnrolmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastEnrolmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastEnrolmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
