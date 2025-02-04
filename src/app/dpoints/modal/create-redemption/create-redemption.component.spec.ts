import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRedemptionComponent } from './create-redemption.component';

describe('CreateRedemptionComponent', () => {
  let component: CreateRedemptionComponent;
  let fixture: ComponentFixture<CreateRedemptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRedemptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRedemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
