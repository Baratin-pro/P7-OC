import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Router API

  private urlUser: string = 'http://localhost:3000/api/user';

  // Constructor 

  constructor(private http: HttpClient) { }

  // Function : Get all Users
  getAllUsers(): Observable<any> {
    return this.http.get(this.urlUser);
  }

  // Function : Get One User
  getProfilUser(): Observable<any> {
    return this.http.get(this.urlUser + '/profil');
  }

  // Function : Modify User
  modifyUser(file): Observable<any> {
    return this.http.put(this.urlUser + "/update", file)
  }

  // Function : Delete User
  deleteUser(id: string): Observable<any> {
    return this.http.delete(this.urlUser + '/' + id);
  }
}
