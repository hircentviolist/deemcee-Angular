import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpointsComponent } from './dpoints.component';

describe('DpointsComponent', () => {
  let component: DpointsComponent;
  let fixture: ComponentFixture<DpointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
