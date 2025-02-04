import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpointsManagementComponent } from './dpoints-management.component';

describe('DpointsManagementComponent', () => {
  let component: DpointsManagementComponent;
  let fixture: ComponentFixture<DpointsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpointsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpointsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
