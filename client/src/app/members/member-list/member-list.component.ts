import { Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { UserParams } from 'src/app/_models/user-params';
import { Member, Pagination, User } from 'src/app/models';
import { AccountService, MemberService } from 'src/app/services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  members$: Observable<Member[]>;
  user$: Observable<User>;
  pagination: Pagination;
  userParams: UserParams;

  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];

  constructor(
    private _memberSvc: MemberService,
    private _accSvc: AccountService,
  ) { }

  ngOnInit(): void {
    this.user$ = this._accSvc.currentUser$;
    this.resetFilters();
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
    this.user$.pipe(
      first(),
      tap((user) => this.userParams = new UserParams(user)),
    ).subscribe();

    this.loadMembers();
  }

  pageChanged(e) {
    this.userParams.pageNumber = e.page;
    this.loadMembers();
  }
}
