import { ToastrService } from 'ngx-toastr';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { AccountService } from '../services';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let accountSvcSpy: jasmine.SpyObj<AccountService>;

  beforeEach(async () => {
    accountSvcSpy = jasmine.createSpyObj<AccountService>('AccountService', ['login']);

    await TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule ],
      declarations: [ NavComponent ],
      providers: [
        { provide: AccountService, useValue: accountSvcSpy },
        { provide: ToastrService, useValue: {} },
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
