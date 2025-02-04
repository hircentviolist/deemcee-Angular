import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerTeacherFormComponent } from './manager-teacher-form.component';

describe('ManagerTeacherFormComponent', () => {
  let component: ManagerTeacherFormComponent;
  let fixture: ComponentFixture<ManagerTeacherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerTeacherFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerTeacherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
