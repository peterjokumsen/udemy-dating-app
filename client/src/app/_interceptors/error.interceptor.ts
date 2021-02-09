import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private _router: Router,
    private _toastr: ToastrService,
    private _accSvc: AccountService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error) {
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                const modelStateErrors = [];
                for (const key in error.error.errors) {
                  if (error?.error?.errors[key]) {
                    modelStateErrors.push(error.error.errors[key]);
                  }
                }

                throw modelStateErrors.flat();
              } else {
                this._toastr.error(error.error.title, error.status);
              }

              break;

            case 401:
              this._toastr.error('Failed to retrieve data from server, please login to continue...', 'Login Required');
              this._accSvc.logout();
              break;

            case 404:
              this._router.navigateByUrl('/not-found');
              break;

            case 500:
              const navigateExtras: NavigationExtras = { state: { error: error.error } };
              this._router.navigateByUrl('/server-error', navigateExtras);
              break;

            default:
              this._toastr.error('Something unexpected went wrong');
              console.error(error);
              break;
          }
        }

        return throwError(error);
      }),
    );
  }
}
