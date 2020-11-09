import { MockComponent } from 'ng-mocks';

import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from '../register/register.component';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpSpy },
      ],
      declarations: [
        HomeComponent,
        MockComponent(RegisterComponent),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
