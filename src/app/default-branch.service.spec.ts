import { TestBed } from '@angular/core/testing';

import { DefaultBranchService } from './default-branch.service';

describe('DefaultBranchService', () => {
  let service: DefaultBranchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultBranchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
