import { TestBed } from '@angular/core/testing';

import { ModuleControlService } from './module-control.service';

describe('ModuleControlService', () => {
  let service: ModuleControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
