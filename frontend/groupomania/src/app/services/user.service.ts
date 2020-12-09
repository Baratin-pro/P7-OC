import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

// Router API

  private routerUser: string = 'http://localhost:3000/api/user';

// Constructor 

  constructor(private http: HttpClient ) { }

// Function : Get all Users
  getAllUsers(): Observable<any> {
    return this.http.get(this.routerUser)
  }

// Function : Get One User
  getUser(id: string): Observable<any> {
    return this.http.get(this.routerUser + '/' + id)
  }

// Function : Modify User
// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------  

// Function : Delete User
  deleteUser(id: string): Observable<any> {
    return this.http.delete(this.routerUser + '/' + id)
  }
}
