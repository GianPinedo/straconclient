import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { rolGuard } from './rol.guard';

describe('rolGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => rolGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
