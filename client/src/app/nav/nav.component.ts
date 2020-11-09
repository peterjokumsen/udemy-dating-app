import { ToastrService } from 'ngx-toastr';

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ErrorResponse, LoginModel } from '../models';
import { AccountService } from '../services';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  @Input() title: string;
  model: LoginModel = { username: '', password: '' };

  constructor(
    private _router: Router,
    private _toastr: ToastrService,
    public accountService: AccountService,
  ) { }

  ngOnInit(): void {
  }

  login(): void {
    this.accountService.login(this.model).subscribe(r => {
      this._router.navigateByUrl('/members');
    }, (e: ErrorResponse) => {
      this._toastr.error(e.error.title);
      console.error(e);
    });
  }

  logout(): void {
    this.accountService.logout();
    this._router.navigateByUrl('/');
  }
}
