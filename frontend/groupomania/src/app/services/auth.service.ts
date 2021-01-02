import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionService } from './cookies.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Identification

  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken: string;
  private userId: string;
  private admin: number;

  private authTokenCookie: string;
  private userIdCookie: number;
  private adminCookie: number;

  msgErr: string;

  // Router API

  private urlUser: string = 'http://localhost:3000/api/user';



  // Constructor

  constructor(private http: HttpClient,
    private router: Router,
    private sessionService: SessionService) { }

  // Function: Create user

  createUser(userNew: object): Observable<any> {
    return this.http.post(this.urlUser + '/signup', userNew)
  }

  // Function: Login user

  loginUser(emails: string, passwords): any {
    return this.http.post(this.urlUser + '/login', { emails, passwords })
      .pipe(
        tap((response: { userId: string, token: string, admin: number }) => {
          this.userId = response.userId;
          this.admin = response.admin;
          this.authToken = response.token;
          this.sessionService.getToken(this.authToken);
          this.sessionService.getAdmin(this.admin);
          this.sessionService.getUser(this.userId);
        })
      )
  }

  // Function: Return cookies 

  getToken() {
    this.authTokenCookie = this.sessionService.getTokenCookie();
    return this.authTokenCookie;
  }
  getUserId() {
    this.userIdCookie = this.sessionService.getUserCookie();
    return this.userIdCookie;
  }
  getAdmin() {
    this.adminCookie = this.sessionService.getAdminCookie();
    return this.adminCookie;
  }


  // Function: Logout 

  logout(): any {
    this.sessionService.deleteCookiesAll();
    this.authToken = null;
    this.userId = null;
    this.isAuth$.next(false);
    this.router.navigate(['login']);

  }
}
