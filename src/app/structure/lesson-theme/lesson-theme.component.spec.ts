import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonThemeComponent } from './lesson-theme.component';

describe('LessonThemeComponent', () => {
  let component: LessonThemeComponent;
  let fixture: ComponentFixture<LessonThemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonThemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
