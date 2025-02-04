import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassLessonComponent } from './class-lesson.component';

describe('ClassLessonComponent', () => {
  let component: ClassLessonComponent;
  let fixture: ComponentFixture<ClassLessonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassLessonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
