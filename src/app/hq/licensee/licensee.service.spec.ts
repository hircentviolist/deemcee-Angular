import { TestBed } from '@angular/core/testing';

import { LicenseeService } from './licensee.service';

describe('LicenseeService', () => {
  let service: LicenseeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LicenseeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
