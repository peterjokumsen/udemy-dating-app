import { Component, Input, OnInit } from '@angular/core';

import { AccountService } from '../_services/account.service';
import { LoginModel } from '../models/login-model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  @Input() title: string;
  model: LoginModel = { username: '', password: '' };

  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
  }

  login(): void {
    this.accountService.login(this.model).subscribe(r => {
      console.log(r);
    }, e => {
      console.error(e);
    });
  }

  logout(): void {
    this.accountService.logout();
  }
}
