import { ToastrService } from 'ngx-toastr';
import { noop, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AccountService } from '../_services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _accountService: AccountService,
    private _toastr: ToastrService,
  ) {}

  canActivate(): Observable<boolean> {
    return this._accountService.currentUser$.pipe(
      map(u => !!u),
      tap(allowed => !allowed ? this._toastr.error('No such luck. (Please login)') : noop),
    );
  }
}
