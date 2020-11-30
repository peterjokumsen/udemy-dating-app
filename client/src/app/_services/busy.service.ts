import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;

  constructor(
    private _spinnerSvc: NgxSpinnerService,
  ) { }

  busy(): void {
    this.busyRequestCount++;
    this._spinnerSvc.show(undefined, {
      type: 'line-scale-party',
      bdColor: 'rgba(255, 255, 255, 0)',
      color: '#333333',
    });
  }

  idle(): void {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this._spinnerSvc.hide();
    }
  }
}
