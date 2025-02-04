import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAssignmentDetailsComponent } from './video-assignment-details.component';

describe('VideoAssignmentDetailsComponent', () => {
  let component: VideoAssignmentDetailsComponent;
  let fixture: ComponentFixture<VideoAssignmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoAssignmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoAssignmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
