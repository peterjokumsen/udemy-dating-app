import { Component, OnInit } from '@angular/core';

import { AccountService } from './_services/account.service';
import { UserWithToken } from './models/user-with-token';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'The Udemy Dating App';

  constructor(private _accountService: AccountService) {}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(): void {
    const user: UserWithToken = JSON.parse(localStorage.getItem('user'));
    this._accountService.setCurrentUser(user);
  }
}
