import { Observable, of, ReplaySubject } from 'rxjs';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  protected _memberSource = new ReplaySubject<Member[]>(1);
  protected _members$ = this._memberSource.asObservable();

  baseUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient,
  ) {
    this._memberSource.next([]);
  }

  getMembers(): Observable<Member[]> {
    return this._members$.pipe(
      switchMap((members) => members?.length > 0 ? of(members) : this._http.get<Member[]>(`${this.baseUrl}users`).pipe(
        tap((apiMembers) => this._memberSource.next(apiMembers)),
      )),
    );
  }

  getMember(username: string): Observable<Member> {
    return this._members$.pipe(
      map((members) => members?.find((m) => m.username.toLowerCase() === username.toLowerCase())),
      switchMap((member) => !member ? this._http.get<Member>(`${this.baseUrl}users/${username}`) : of(member)),
    );
  }

  updateMember(member: Member): Observable<any> {
    return this._http.put(`${this.baseUrl}users`, member).pipe(
      withLatestFrom(this._members$),
      tap(([_, members]) => {
        this._memberSource.next([
          ...members.filter(({ id }) => id !== member.id),
          member,
        ]);
      }),
    );
  }
}
