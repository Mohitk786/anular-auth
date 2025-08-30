import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { publicPageGuard } from './public-page-guard';

describe('publicPageGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => publicPageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
