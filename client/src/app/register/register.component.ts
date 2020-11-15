import { ToastrService } from 'ngx-toastr';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ErrorResponse } from '../models';
import { AccountService } from '../services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  model: any = {};

  constructor(
    private _accountService: AccountService,
    private _toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  register(): void {
    this._accountService.register(this.model).subscribe(r => {
      console.log(r);
      this.cancel();
    }, (e: ErrorResponse) => {
      this._toastr.error(e.error.title);
      console.error(e);
    });
  }

  cancel(): void {
    this.cancelRegister.emit(false);
  }
}
