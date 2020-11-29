import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { Member } from 'src/app/models';
import { MemberService } from 'src/app/services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailComponent implements OnInit {
  member$: Observable<Member>;
  galleryOptions: NgxGalleryOptions[];
  galleryImages$: Observable<NgxGalleryImage[]>;

  constructor(
    private _memberSvc: MemberService,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.member$ = this._memberSvc.getMember(this._route.snapshot.paramMap.get('username')).pipe(
      shareReplay(1),
    );

    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false,
    }];

    this.galleryImages$ = this.member$.pipe(
      filter((member) => !!member?.photos),
      map((member) => member.photos.map((p) => ({ small: p.url, medium: p.url, big: p.url }))),
    );
  }
}
