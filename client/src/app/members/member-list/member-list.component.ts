import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserParams } from 'src/app/_models/user-params';
import { Member, Pagination } from 'src/app/models';
import { MemberService } from 'src/app/services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  members$: Observable<Member[]>;
  userParams: UserParams;

  pagination: Pagination;
  get hasPagination(): boolean { return !!this.pagination; }
  get totalResults(): string {
    return !this.pagination ? 'Loading...' : this.pagination.totalItems.toString();
  }

  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];

  constructor(
    private _memberSvc: MemberService,
  ) { }

  ngOnInit(): void {
    this.userParams = this._memberSvc.getUserParams();

    this.loadMembers();
  }

  loadMembers() {
    this.members$ = this._memberSvc.getMembers(this.userParams).pipe(
      tap((page) => {
        this.pagination = page.pagination;
      }),
      map((page) => page.result),
    );
  }

  resetFilters() {
    this.userParams = this._memberSvc.resetUserParams();

    this.loadMembers();
  }

  pageChanged(e) {
    this.userParams = this._memberSvc.updateParams({ ...this.userParams, pageNumber: e.page });

    this.loadMembers();
  }
}
