import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member, PaginatedResult, Photo, UserParams } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  protected _fetchedAll = false;

  baseUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient,
  ) { }

  private getPaginationHeaders(pageNumber: number, pageSize: number): HttpParams {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());

    return params;
  }

  private getPaginatedResult<T>(url: string, params: HttpParams): Observable<PaginatedResult<T>> {
    return this._http.get<T>(url, { observe: 'response', params }).pipe(
      map((response) => new PaginatedResult<T>(response)),
    );
  }

  getMembers(userParams: UserParams): Observable<PaginatedResult<Member[]>> {
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);

    return this.getPaginatedResult<Member[]>(`${this.baseUrl}users`, params);
  }

  getMember(username: string): Observable<Member> {
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
