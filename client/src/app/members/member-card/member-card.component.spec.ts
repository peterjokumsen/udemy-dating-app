import { Member } from 'src/app/models';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberCardComponent } from './member-card.component';

describe('MemberCardComponent', () => {
  let component: MemberCardComponent;
  let fixture: ComponentFixture<MemberCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberCardComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberCardComponent);
    component = fixture.componentInstance;
    component.member = {
      knownAs: 'hello world',
      photoUrl: '',
    } as Member;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
