import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreezeComponent } from './freeze.component';

describe('FreezeComponent', () => {
  let component: FreezeComponent;
  let fixture: ComponentFixture<FreezeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreezeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreezeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
