import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  model: any = {};

  constructor(private _accSvc: AccountService) { }

  ngOnInit(): void {
  }

  register(): void {
    this._accSvc.register(this.model).subscribe(r => {
      console.log(r);
      this.cancel();
    }, e => console.error(e));
  }

  cancel(): void {
    this.cancelRegister.emit(false);
  }
}
