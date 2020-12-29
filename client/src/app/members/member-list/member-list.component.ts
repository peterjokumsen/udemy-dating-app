import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;

  constructor(
    private _memberSvc: MemberService,
  ) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.members$ = this._memberSvc.getMembers(this.pageNumber, this.pageSize).pipe(
      tap((page) => {
        this.pagination = page.pagination;
      }),
      map((page) => page.result),
    );
  }

  pageChanged(e) {
    this.pageNumber = e.page;
    this.loadMembers();
  }
}
