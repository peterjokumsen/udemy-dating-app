import { Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from '../services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private _accountSvc: AccountService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const currentToken$ = this._accountSvc.currentUser$.pipe(
      first(),
      map((user) => user?.token),
    );

    return currentToken$.pipe(
      switchMap((token) => {
        if (!!token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        return next.handle(request);
      })
    );
  }
}
