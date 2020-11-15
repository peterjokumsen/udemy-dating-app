import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel, RegisterModel, UserWithToken } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private _currentUserSource = new ReplaySubject<UserWithToken>(1);
  currentUser$ = this._currentUserSource.asObservable();

  baseUrl = 'https://localhost:5001/';

  constructor(private _http: HttpClient) { }

  login(model: LoginModel): Observable<UserWithToken> {
    return this._http.post(`${this.baseUrl}account/login`, model).pipe(
      tap((user: UserWithToken) => {
        if (!!user) {
          localStorage.setItem('user', JSON.stringify(user));
          this._currentUserSource.next(user);
        }
      })
    );
  }

  register(model: RegisterModel): Observable<UserWithToken> {
    return this._http.post(`${this.baseUrl}account/register`, model).pipe(
      tap((user: UserWithToken) => {
        if (!!user) {
          localStorage.setItem('user', JSON.stringify(user));
          this._currentUserSource.next(user);
        }
      }),
    );
  }

  setCurrentUser(user: UserWithToken): void {
    this._currentUserSource.next(user);
  }

  logout(): void {
    localStorage.removeItem('user');
    this._currentUserSource.next(null);
  }
}
