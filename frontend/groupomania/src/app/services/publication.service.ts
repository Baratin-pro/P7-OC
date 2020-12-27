import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  // Router API 

  private urlPublication: string = 'http://localhost:3000/api/publication';

  // Constructor

  constructor(private http: HttpClient) { }

  // Function : Create Publication
  createPublication(publicationNew: object): Observable<any> {
    return this.http.post(this.urlPublication + '/create', publicationNew);
  }

  // Function : Get all Publications
  getAllPublications(): Observable<any> {
    return this.http.get(this.urlPublication);
  }

  // Function : Get One Publication
  getOnePublication(id: string): Observable<any> {
    return this.http.get(this.urlPublication + '/' + id);
  }

  // Function : Modify Publication
  modifyPublication(id: string, publicationModify: object): Observable<any> {
    return this.http.put(this.urlPublication + "/" + id, publicationModify)
  }


  // Function : Detele One Publication
  deletePublication(id: string): Observable<any> {
    return this.http.delete(this.urlPublication + '/' + id);
  }
}
