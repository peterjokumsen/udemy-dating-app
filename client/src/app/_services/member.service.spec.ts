import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MemberService } from './member.service';

describe('MemberService', () => {
  let service: MemberService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpSpy },
      ],
    });

    service = TestBed.inject(MemberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
