import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member, Photo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  protected _memberSource = new ReplaySubject<Member[]>(1);
  protected _members$ = this._memberSource.asObservable();
  protected _fetchedAll = false;

  baseUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient,
  ) {
    this._memberSource.next([]);
  }

  protected patchMembers(members: Member[], updatedMember?: Member): void {
    if (!updatedMember) {
      this._memberSource.next(members);
      return;
    }

    this._memberSource.next([
      ...members.filter(({ id }) => id !== updatedMember.id),
      updatedMember,
    ]);
  }

  getMembers(): Observable<Member[]> {
    return this._members$.pipe(
      switchMap((members) => members?.length > 0 && this._fetchedAll ? of(members) : this._http.get<Member[]>(`${this.baseUrl}users`).pipe(
        tap((apiMembers) => {
          this._fetchedAll = true;
          this.patchMembers(apiMembers);
        }),
      )),
    );
  }

  getMember(username: string): Observable<Member> {
    return this._members$.pipe(
      map((members) => members?.find((m) => m.username.toLowerCase() === username.toLowerCase())),
      switchMap((member) => !!member ? of(member) : this._http.get<Member>(`${this.baseUrl}users/${username}`).pipe(
        withLatestFrom(this._members$),
        map(([receivedMember, members]) => {
          this.patchMembers(members, receivedMember);
          return receivedMember;
        }),
      )),
    );
  }

  updateMember(member: Member): Observable<any> {
    return this._http.put(`${this.baseUrl}users`, member).pipe(
      withLatestFrom(this._members$),
      tap(([_, members]) => {
        this.patchMembers(members, member);
      }),
    );
  }

  setPhotoAsMain(member: Member, photo: Photo): Observable<Member> {
    return this._http.put(`${this.baseUrl}users/set-main-photo/${photo.id}`, {}).pipe(
      withLatestFrom(this._members$),
      map(([_, members]) => {
        const updatedMember = {
          ...member,
          photoUrl: photo.url,
          photos: member.photos.map((p) => ({ ...p, isMain: p.id === photo.id })),
        };

        this.patchMembers(members, updatedMember);

        return updatedMember;
      }),
    );
  }

  deletePhoto(member: Member, photo: Photo): Observable<Member> {
    return this._http.delete(`${this.baseUrl}users/delete-photo/${photo.id}`).pipe(
      withLatestFrom(this._members$),
      map(([_, members]) => {
        const updatedMember = {
          ...member,
          photos: member.photos.filter(({ id }) => id !== photo.id),
        };

        this.patchMembers(members, updatedMember);
        return updatedMember;
      }),
      catchError(() => of(member)),
    );
  }
}
