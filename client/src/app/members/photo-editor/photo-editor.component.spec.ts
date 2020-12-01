import { cold } from 'jasmine-marbles';
import { MockDirective } from 'ng-mocks';
import { FileDropDirective, FileSelectDirective } from 'ng2-file-upload';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';
import { Member } from 'src/app/models';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoEditorComponent } from './photo-editor.component';

describe('PhotoEditorComponent', () => {
  let component: PhotoEditorComponent;
  let fixture: ComponentFixture<PhotoEditorComponent>;
  let accSvc: AccountService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: AccountService, useValue: {} },
        { provide: MemberService, useValue: {} },
      ],
      declarations: [
        PhotoEditorComponent,
        MockDirective(FileDropDirective),
        MockDirective(FileSelectDirective),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoEditorComponent);
    accSvc = TestBed.inject(AccountService);
    accSvc.currentUser$ = cold('-');

    component = fixture.componentInstance;
    component.member = {} as Member;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
