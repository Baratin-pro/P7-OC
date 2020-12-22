import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Identification

  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken: string;
  private userId: string;

  // Router API

  private urlUser: string = 'http://localhost:3000/api/user';



  // Constructor

  constructor(private http: HttpClient, private router: Router) { }

  // Function : Create user

  createUser(userNew: object): Observable<any> {
    return this.http.post(this.urlUser + '/signup', userNew)
  }

  // Function : Login user

  loginUser(emails: string, passwords): any {
    this.http.post(this.urlUser + '/login', { emails, passwords }).subscribe(
      (response: { userId: string, token: string }) => {
        this.userId = response.userId;
        this.authToken = response.token;
        this.isAuth$.next(true);
        this.router.navigate(['/accueil']);
      }
    )
  }
  getToken() {
    return this.authToken;
  }


  /* // Function: Logout 
  
     logout(): any{
      this.authToken = null;
      this.userId = null;
      this.isAuth$.next(false);
      this.router.navigate(['login']);
    } */
}
