import { TestBed } from '@angular/core/testing';
import { AccountService } from '../services';
import { JwtInterceptor } from './jwt.interceptor';

describe('JwtInterceptor', () => {
  let accSvc: AccountService;
  let interceptor: JwtInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JwtInterceptor,
        { provide: AccountService, useValue: {} },
      ]
    });

    interceptor = TestBed.inject(JwtInterceptor);
    accSvc = TestBed.inject(AccountService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
