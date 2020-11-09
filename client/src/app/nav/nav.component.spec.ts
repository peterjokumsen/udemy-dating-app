import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { AccountService } from '../_services/account.service';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let accountSvcSpy: jasmine.SpyObj<AccountService>;

  beforeEach(async () => {
    accountSvcSpy = jasmine.createSpyObj<AccountService>('AccountService', ['login']);

    await TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ NavComponent ],
      providers: [
        { provide: AccountService, useValue: accountSvcSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
