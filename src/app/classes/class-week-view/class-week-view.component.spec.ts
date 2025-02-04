import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassWeekViewComponent } from './class-week-view.component';

describe('ClassWeekViewComponent', () => {
  let component: ClassWeekViewComponent;
  let fixture: ComponentFixture<ClassWeekViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassWeekViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassWeekViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
