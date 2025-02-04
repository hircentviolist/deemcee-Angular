import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeCategoryModalComponent } from './upgrade-category-modal.component';

describe('UpgradeCategoryModalComponent', () => {
  let component: UpgradeCategoryModalComponent;
  let fixture: ComponentFixture<UpgradeCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
