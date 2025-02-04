import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonThemeFormComponent } from './lesson-theme-form.component';

describe('LessonThemeFormComponent', () => {
  let component: LessonThemeFormComponent;
  let fixture: ComponentFixture<LessonThemeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonThemeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonThemeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
