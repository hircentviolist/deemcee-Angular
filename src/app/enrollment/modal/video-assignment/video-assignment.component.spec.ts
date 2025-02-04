import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAssignmentComponent } from './video-assignment.component';

describe('VideoAssignmentComponent', () => {
  let component: VideoAssignmentComponent;
  let fixture: ComponentFixture<VideoAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
