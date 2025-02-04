import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExtendComponent } from './edit-extend.component';

describe('EditExtendComponent', () => {
  let component: EditExtendComponent;
  let fixture: ComponentFixture<EditExtendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditExtendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExtendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
