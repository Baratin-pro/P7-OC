import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
// Router API

  private urlUser: string = 'http://localhost:3000/api/user';



// Constructor

  constructor(private http: HttpClient, private router: Router) { }

// Function : Create user

  createUser(userNew: object): Observable<any>{
    return this.http.post(this.urlUser + '/signup', userNew)
  }
  
// Function : Login user

  loginUser(emails: string, passwords): Observable<any>{
    return this.http.post(this.urlUser +'/login', {emails, passwords})
  }


/* // Function: Logout 

   logout(): any{
    this.authToken = null;
    this.userId = null;
    this.isAuth$.next(false);
    this.router.navigate(['login']);
  } */
}
