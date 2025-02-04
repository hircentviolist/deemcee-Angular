import { TestBed } from '@angular/core/testing';

import { HqGuard } from './hq.guard';

describe('HqGuard', () => {
  let guard: HqGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HqGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
