import { Observable } from 'rxjs';
import { Member } from 'src/app/models';
import { MemberService } from 'src/app/services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  members$: Observable<Member[]>;

  constructor(
    private _memberSvc: MemberService,
  ) { }

  ngOnInit(): void {
    this.members$ = this._memberSvc.getMembers();
  }
}
