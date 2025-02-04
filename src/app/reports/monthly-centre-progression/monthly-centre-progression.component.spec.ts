import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyCentreProgressionComponent } from './monthly-centre-progression.component';

describe('MonthlyCentreProgressionComponent', () => {
  let component: MonthlyCentreProgressionComponent;
  let fixture: ComponentFixture<MonthlyCentreProgressionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyCentreProgressionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyCentreProgressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
