import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassLessonModalComponent } from './class-lesson-modal.component';

describe('ClassLessonModalComponent', () => {
  let component: ClassLessonModalComponent;
  let fixture: ComponentFixture<ClassLessonModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassLessonModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassLessonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
