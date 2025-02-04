import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowParentComponent } from './show-parent.component';

describe('ShowParentComponent', () => {
  let component: ShowParentComponent;
  let fixture: ComponentFixture<ShowParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
