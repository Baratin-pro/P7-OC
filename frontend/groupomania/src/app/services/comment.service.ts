import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  // Router API

  private urlComment: string = 'http://localhost:3000/api/comment';

  // Constructor

  constructor(private http: HttpClient) { }

  // Function : Create Comment

  createComment(commentNew: object): Observable<any> {
    return this.http.post(this.urlComment + "/create", commentNew);
  }

  // Function : Get all Comments

  getAllComments(idPublication: string): Observable<any> {
    return this.http.get(this.urlComment + "/publication/" + idPublication)
  }

  // Function : Get One Comment

  getOneComment(id: string): Observable<any> {
    return this.http.get(this.urlComment + '/' + id)
  }

  // Function : Modify Comment

  modifyComment(idComment, commentDescription: object): Observable<any> {
    return this.http.put(this.urlComment + "/" + idComment, commentDescription)
  }

  // Function : Detele One Comment

  deleteComment(id: string): Observable<any> {
    return this.http.delete(this.urlComment + '/' + id)
  }
}
