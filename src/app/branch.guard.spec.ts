import { TestBed } from '@angular/core/testing';

import { BranchGuard } from './branch.guard';

describe('BranchGuard', () => {
  let guard: BranchGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BranchGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
