import { Observable, of } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member, PaginatedResult, Photo, UserParams } from '../models';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private _userParams: UserParams;
  protected _fetchedAll = false;

  baseUrl = environment.apiUrl;
  memberCache = new Map();

  constructor(
    private _http: HttpClient,
    private _accSvc: AccountService,
  ) { }

  private getPaginationHeaders(inputs?: UserParams): HttpParams {
    let params = new HttpParams();
    for (const key in inputs) {
      if (!inputs[key]) continue;
      params = params.append(key, inputs[key].toString());
    }

    return params;
  }

  private getPaginatedResult<T>(url: string, params: HttpParams): Observable<PaginatedResult<T>> {
    return this._http.get<T>(url, { observe: 'response', params }).pipe(
      map((response) => new PaginatedResult<T>(response)),
    );
  }

  resetUserParams(): UserParams {
    this._accSvc.currentUser$.pipe(
      first(),
      map((user) => new UserParams(user)),
      tap((params) => this._userParams = params),
    ).subscribe();

    return this._userParams;
  }

  getUserParams(): UserParams {
    return !this._userParams ? this.resetUserParams() : this._userParams;
  }

  updateParams(p: Partial<UserParams>): UserParams {
    this._userParams = { ...this._userParams, ...p };
    return this._userParams;
  }

  getMembers(userParams: UserParams): Observable<PaginatedResult<Member[]>> {
    const key = Object.values(userParams).join('-');
    let response = this.memberCache.get(key);
    if (!!response) return of(response);

    const params = this.getPaginationHeaders(userParams);

    return this.getPaginatedResult<Member[]>(`${this.baseUrl}users`, params).pipe(
      tap(r => this.memberCache.set(key, r)),
    );
  }

  getMember(username: string): Observable<Member> {
    const member = [...this.memberCache.values()].reduce(
      (arr, elem) => arr.concat(elem.result), [],
    ).find((u: Member) => u.username === username);

    if (!!member) return of(member);

    return this._http.get<Member>(`${this.baseUrl}users/${username}`).pipe(
    );
  }

  updateMember(member: Member): Observable<any> {
    return this._http.put(`${this.baseUrl}users`, member).pipe(
    );
  }

  setPhotoAsMain(member: Member, photo: Photo): Observable<Member> {
    return this._http.put(`${this.baseUrl}users/set-main-photo/${photo.id}`, {}).pipe(
      map(() => {
        const updatedMember = {
          ...member,
          photoUrl: photo.url,
          photos: member.photos.map((p) => ({ ...p, isMain: p.id === photo.id })),
        };

        return updatedMember;
      }),
    );
  }

  deletePhoto(member: Member, photo: Photo): Observable<Member> {
    return this._http.delete(`${this.baseUrl}users/delete-photo/${photo.id}`).pipe(
      map(() => {
        const updatedMember = {
          ...member,
          photos: member.photos.filter(({ id }) => id !== photo.id),
        };

        return updatedMember;
      }),
      catchError(() => of(member)),
    );
  }
}
