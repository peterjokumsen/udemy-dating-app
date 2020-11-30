import { cold } from 'jasmine-marbles';
import { ToastrService } from 'ngx-toastr';
import { AccountService, MemberService } from 'src/app/services';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
      declarations: [ MemberEditComponent ]
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
