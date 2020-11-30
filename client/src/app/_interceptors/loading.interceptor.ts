import { Observable } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BusyService } from '../services';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(
    private _busySvc: BusyService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this._busySvc.busy();
    return next.handle(request).pipe(
      delay(1000),
      finalize(() => {
        this._busySvc.idle();
      }),
    );
  }
}
