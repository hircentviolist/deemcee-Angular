import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastEnrollmentComponent } from './past-enrollment.component';

describe('PastEnrollmentComponent', () => {
  let component: PastEnrollmentComponent;
  let fixture: ComponentFixture<PastEnrollmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastEnrollmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
