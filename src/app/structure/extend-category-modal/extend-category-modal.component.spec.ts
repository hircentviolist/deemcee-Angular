import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendCategoryModalComponent } from './extend-category-modal.component';

describe('ExtendCategoryModalComponent', () => {
  let component: ExtendCategoryModalComponent;
  let fixture: ComponentFixture<ExtendCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
