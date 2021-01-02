import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Liked_dislikedService {

  // Router API Liked

  private urlLiked: string = 'http://localhost:3000/api/liked';

  // Router API Liked

  private urlDislikedDelete: string = 'http://localhost:3000/api/disliked';

  // Constructor

  constructor(private http: HttpClient) { }

  // Function : Create Liked

  postLiked(idPublications: any): Observable<any> {
    return this.http.post(this.urlLiked, idPublications);
  }

  // Function : Create Disliked

  postDisliked(idPublications: any): Observable<any> {
    return this.http.post(this.urlDislikedDelete, idPublications);
  }


}
