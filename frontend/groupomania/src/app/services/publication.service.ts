import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

// Router API 

  private routerPublicationCreate: string = 'http://localhost:3000/api/publication';
  private routerPublication: string = 'http://localhost:3000/api/publication';

// Constructor

  constructor(private http: HttpClient) { }

// Function : Create Publication
// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------

// Function : Get all Publications
  getAllPublications(): Observable<any> {
    return this.http.get(this.routerPublication)
  }

// Function : Get One Publication
  getOnePublication(id: string): Observable<any> {
    return this.http.get(this.routerPublication + '/' + id)
  }

// Function : Modify Publication
// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------

// Function : Detele One Publication
  deletePublication(id: string): Observable<any> {
    return this.http.delete(this.routerPublication + '/' + id)
  }  
}
