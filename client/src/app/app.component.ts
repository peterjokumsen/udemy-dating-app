import { Observable } from 'rxjs';
import { first, map, shareReplay } from 'rxjs/operators';
import { User } from 'src/models/user';

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'The Udemy Dating App';
  users$: Observable<User[]>;

  constructor(protected _http: HttpClient) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.users$ = this._http.get('https://localhost:5001/users').pipe(
        first(),
        map((r) => r as User[]),
        shareReplay(1),
    );
  }
}
