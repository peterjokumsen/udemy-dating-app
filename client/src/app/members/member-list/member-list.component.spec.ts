import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { AccountService, MemberService } from 'src/app/services';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MemberListComponent } from './member-list.component';

describe('MemberListComponent', () => {
  let component: MemberListComponent;
  let fixture: ComponentFixture<MemberListComponent>;
  let memberSvcSpy: jasmine.SpyObj<MemberService>;

  beforeEach(async () => {
    memberSvcSpy = jasmine.createSpyObj<MemberService>('MemberService', ['getMembers']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
      ],
      providers: [
        { provide: MemberService, useValue: memberSvcSpy },
        { provide: AccountService, useValue: { currentUser$: of({}) } },
      ],
      declarations: [ MemberListComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberListComponent);
    component = fixture.componentInstance;
    memberSvcSpy.getMembers.and.returnValue(cold('-'));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
