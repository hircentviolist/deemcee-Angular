import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNotificationModalComponent } from './create-notification-modal.component';

describe('CreateNotificationModalComponent', () => {
  let component: CreateNotificationModalComponent;
  let fixture: ComponentFixture<CreateNotificationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNotificationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNotificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
