import { FileUploader } from 'ng2-file-upload';
import { Observable } from 'rxjs';
import { first, tap, withLatestFrom } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Photo, UserWithToken } from 'src/app/models';
import { AccountService, MemberService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {
  protected _user$: Observable<UserWithToken>;

  @Input() member: Member;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;

  constructor(
    private _accSvc: AccountService,
    private _memberSvc: MemberService,
  ) { }

  ngOnInit(): void {
    this._user$ = this._accSvc.currentUser$;
    this._user$.pipe(
      first(),
      tap((user) => this.initializeUploader(user)),
    ).subscribe();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(user: UserWithToken): void {
    this.uploader = new FileUploader({
      url: `${this.baseUrl}users/add-photo`,
      authToken: `Bearer ${user.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member.photos.push(photo);
      }
    };
  }

  setMainPhoto(photo: Photo): void {
    this._memberSvc.setPhotoAsMain(this.member, photo).pipe(
      withLatestFrom(this._user$),
      tap(([member, user]) => {
        user.photoUrl = photo.url;
        this._accSvc.setCurrentUser(user);
        this.member = member;
      }),
      first(),
    ).subscribe();
  }

  deletePhoto(photo: Photo): void {
    this._memberSvc.deletePhoto(this.member, photo).pipe(
      tap((member) => this.member = member),
      first(),
    ).subscribe();
  }
}
