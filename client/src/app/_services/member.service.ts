import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member, PaginatedResult, Photo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  protected _fetchedAll = false;

  baseUrl = environment.apiUrl;
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();

  constructor(
    private _http: HttpClient,
  ) { }

  getMembers(page?: number, itemsPerPage?: number): Observable<PaginatedResult<Member[]>> {
    let params = new HttpParams();
    if (!!page && !!itemsPerPage) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }
    return this._http.get<Member[]>(
      `${this.baseUrl}users`,
      { observe: 'response', params },
    ).pipe(
      map((response) => {
        this.paginatedResult.result = response.body;
        if (!!response.headers.get('Pagination')) {
          this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return this.paginatedResult;
      }),
    );
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
