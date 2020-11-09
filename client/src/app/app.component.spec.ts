import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { AccountService } from './services';

describe('AppComponent', () => {
  let accountSvcSpy: jasmine.SpyObj<AccountService>;
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    accountSvcSpy = jasmine.createSpyObj<AccountService>('AccountService', ['setCurrentUser']);
    accountSvcSpy.currentUser$ = of(null);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: AccountService, useValue: accountSvcSpy },
      ],
      declarations: [
        AppComponent,
        MockComponent(NavComponent),
        MockComponent(HomeComponent),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'The Udemy Dating App'`, () => {
    expect(component.title).toEqual('The Udemy Dating App');
  });

  describe('after initialisation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display app-nav', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('app-nav')).toBeTruthy();
    });
  });
});
