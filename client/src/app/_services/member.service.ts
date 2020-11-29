import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient,
  ) { }

  getMembers(): Observable<Member[]> {
    return this._http.get<Member[]>(`${this.baseUrl}users`);
  }

  getMember(username: string): Observable<Member> {
    return this._http.get<Member>(`${this.baseUrl}users/${username}`);
  }
}
