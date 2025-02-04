import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentStudentFormComponent } from './parent-student-form.component';

describe('ParentStudentFormComponent', () => {
  let component: ParentStudentFormComponent;
  let fixture: ComponentFixture<ParentStudentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentStudentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentStudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
