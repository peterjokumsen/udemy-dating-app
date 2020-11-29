import { MemberService } from 'src/app/services';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberListComponent } from './member-list.component';

describe('MemberListComponent', () => {
  let component: MemberListComponent;
  let fixture: ComponentFixture<MemberListComponent>;
  let memberSvcSpy: jasmine.SpyObj<MemberService>;

  beforeEach(async () => {
    memberSvcSpy = jasmine.createSpyObj<MemberService>('MemberService', ['getMembers']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: MemberService, useValue: memberSvcSpy },
      ],
      declarations: [ MemberListComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
