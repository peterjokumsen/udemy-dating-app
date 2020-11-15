import { ToastrService } from 'ngx-toastr';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let accountSpy: jasmine.SpyObj<AccountService>;

  beforeEach(async () => {
    accountSpy = jasmine.createSpyObj<AccountService>('AccountService', ['register']);

    await TestBed.configureTestingModule({
      imports: [ FormsModule ],
      providers: [
        { provide: AccountService, useValue: accountSpy },
        { provide: ToastrService, useValue: {} },
      ],
      declarations: [ RegisterComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
