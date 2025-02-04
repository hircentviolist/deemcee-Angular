import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointValueComponent } from './point-value.component';

describe('PointValueComponent', () => {
  let component: PointValueComponent;
  let fixture: ComponentFixture<PointValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
