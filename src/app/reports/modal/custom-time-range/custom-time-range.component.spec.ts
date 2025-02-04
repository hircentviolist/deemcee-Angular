import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTimeRangeComponent } from './custom-time-range.component';

describe('CustomTimeRangeComponent', () => {
  let component: CustomTimeRangeComponent;
  let fixture: ComponentFixture<CustomTimeRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTimeRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTimeRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
