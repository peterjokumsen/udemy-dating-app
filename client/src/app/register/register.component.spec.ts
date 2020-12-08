import { MockComponent } from 'ng-mocks';
import { ToastrService } from 'ngx-toastr';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from '../_forms/text-input/text-input.component';
import { AccountService } from '../services';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let accountSpy: jasmine.SpyObj<AccountService>;

  beforeEach(async () => {
    accountSpy = jasmine.createSpyObj<AccountService>('AccountService', ['register']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: AccountService, useValue: accountSpy },
        { provide: ToastrService, useValue: {} },
      ],
      declarations: [
        RegisterComponent,
        MockComponent(TextInputComponent),
      ]
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
