import { cold } from 'jasmine-marbles';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/models';
import { MemberService } from 'src/app/services';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MemberDetailComponent } from './member-detail.component';

describe('MemberDetailComponent', () => {
  let component: MemberDetailComponent;
  let fixture: ComponentFixture<MemberDetailComponent>;
  let memberSvcSpy: jasmine.SpyObj<MemberService>;

  beforeEach(async () => {
    memberSvcSpy = jasmine.createSpyObj<MemberService>('MemberService', ['getMember']);

    await TestBed.configureTestingModule({
      imports: [
        TabsModule,
        RouterTestingModule,
      ],
      declarations: [ MemberDetailComponent ],
      providers: [
        { provide: MemberService, useValue: memberSvcSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberDetailComponent);
    component = fixture.componentInstance;

    memberSvcSpy.getMember.and.returnValue(cold('-0|', [{ photos: [] } as Member]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
