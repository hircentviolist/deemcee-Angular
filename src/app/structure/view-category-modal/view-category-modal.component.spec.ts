import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCategoryModalComponent } from './view-category-modal.component';

describe('ViewCategoryModalComponent', () => {
  let component: ViewCategoryModalComponent;
  let fixture: ComponentFixture<ViewCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
