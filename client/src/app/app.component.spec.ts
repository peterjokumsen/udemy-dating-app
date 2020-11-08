import { cold } from 'jasmine-marbles';

import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: HttpClient, useValue: httpSpy },
      ],
      declarations: [
        AppComponent
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
      httpSpy.get.and.returnValue(cold('0|', [
        [{ id: 'id', userName: 'userName' }],
      ]));

      fixture.detectChanges();
    });

    it('should render title', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('h1').textContent).toContain('The Udemy Dating App');
    });

    it('should show results from api', () => {
      fixture.whenStable().then(() => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('li').textContent).toContain('id - userName');
      });
    });
  });
});
