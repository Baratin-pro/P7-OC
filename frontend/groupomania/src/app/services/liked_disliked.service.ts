import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Liked_dislikedService {

// Router API Liked

  private routerLikedAdd: string = 'http://localhost:3000/api/liked/add';
  private routerLikedDelete: string ='http://localhost:3000/api/liked/delete';

// Router API Liked

  private routerDislikedAdd: string ='http://localhost:3000/api/disliked/add';
  private routerDislikedDelete: string = 'http://localhost:3000/api/disliked/delete';
  
// Constructor

  constructor(private http: HttpClient) { }

// Function : Create Liked
// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------
  
// Function : Delete Liked
 
  deleteLiked(): Observable<any> {
    return this.http.delete(this.routerLikedDelete);
  }

// Function : Create Disliked
// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------

// Function : Detele Lisliked

  deleteDisliked(): Observable<any> {
    return this.http.delete(this.routerDislikedDelete);
  }

}
