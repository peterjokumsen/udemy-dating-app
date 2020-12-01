import { cold } from 'jasmine-marbles';
import { MockComponent } from 'ng-mocks';
import { ToastrService } from 'ngx-toastr';
import { AccountService, MemberService } from 'src/app/services';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoEditorComponent } from '../photo-editor/photo-editor.component';
import { MemberEditComponent } from './member-edit.component';

describe('MemberEditComponent', () => {
  let component: MemberEditComponent;
  let fixture: ComponentFixture<MemberEditComponent>;
  let accSvc: AccountService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: ToastrService, useValue: {} },
        { provide: MemberService, useValue: {} },
        { provide: AccountService, useValue: {} },
      ],
      declarations: [
        MemberEditComponent,
        MockComponent(PhotoEditorComponent),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberEditComponent);
    accSvc = TestBed.inject(AccountService);
    accSvc.currentUser$ = cold('0', [null]);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
