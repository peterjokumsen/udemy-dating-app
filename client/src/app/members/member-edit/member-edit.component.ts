import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { filter, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Member, User } from 'src/app/models';
import { AccountService, MemberService } from 'src/app/services';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;

  member$: Observable<Member>;
  user$: Observable<User>;
  member: Member;

  constructor(
    private _accountSvc: AccountService,
    private _memberSvc: MemberService,
    private _toastSvc: ToastrService,
  ) { }

  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any): void {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  ngOnInit(): void {
    this.user$ = this._accountSvc.currentUser$;
    this.member$ = this.user$.pipe(
      filter((user) => !!user),
      switchMap(({ username }) => this._memberSvc.getMember(username)),
      tap((member) => this.member = member),
      shareReplay(1),
    );
  }

  updateMember(): void {
    this._memberSvc.updateMember(this.member).subscribe(() => {
      this._toastSvc.success('Profile updated successfully');
      this.editForm.reset(this.member);
    });
  }
}
