import { TestBed } from '@angular/core/testing';

import { HttpInterceptor } from './https.interceptor';

describe('HttpInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpInterceptor = TestBed.inject(HttpInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
