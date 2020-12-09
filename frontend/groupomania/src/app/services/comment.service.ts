import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

// Router API

  private routerCommentCreate: string = 'http://localhost:3000/api/comment/create';
  private routerComment: string = 'http://localhost:3000/api/comment';

// Constructor

constructor(private http: HttpClient) { }

// Function : Create Comment
// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------

// Function : Get all Comments
  getAllComments(): Observable<any> {
    return this.http.get(this.routerComment)
  }

// Function : Get One Comment
  getOneComment(id: string): Observable<any> {
    return this.http.get(this.routerComment + '/' + id)
  }

// Function : Modify Comment
// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------

// Function : Detele One Comment
  deletePublication(id: string): Observable<any> {
    return this.http.delete(this.routerComment + '/' + id)
  }  
}
