import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { UserWithToken } from '../models';
import { AccountService } from '../services';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let userSource: ReplaySubject<UserWithToken>;
  let accountSpy: jasmine.SpyObj<AccountService>;

  beforeEach(() => {
    userSource = new ReplaySubject<UserWithToken>(1);

    accountSpy = jasmine.createSpyObj<AccountService>('AccountService', ['setCurrentUser']);
    accountSpy.currentUser$ = userSource.asObservable();

    TestBed.configureTestingModule({
      providers: [
        { provide: AccountService, useValue: accountSpy },
        { provide: ToastrService, useValue: {} },
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
