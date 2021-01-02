import { UserLiked } from './../../models/User_liked.model';
import { Router } from '@angular/router';
import { Liked_dislikedService } from './../../services/liked_disliked.service';
import { PublicationService } from './../../services/publication.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-publication-list',
  templateUrl: './publication-list.component.html',
  styleUrls: ['./publication-list.component.scss']
})
export class PublicationListComponent implements OnInit {

  publications: [];
  loading: boolean;
  errMsg: string;
  idPublications: string;
  dislike: boolean = false;
  like: boolean = false;

  private userId: number;
  private admin: number;

  constructor(private publicationsService: PublicationService,
    private liked_dislikedService: Liked_dislikedService,
    private router: Router,
    private authService: AuthService,
    private statusService: StatusService) { }

  ngOnInit(): void {
    this.loading = true;
    this.getListPublications();
    this.userId = this.authService.getUserId();
    this.admin = this.authService.getAdmin();

  }

  //Function : réduction du nombre de caractères de la description
  onDescriptionlength(caractereLength): string {
    if (caractereLength.length > 250) {
      return caractereLength.slice(0, 250) + " [...]";
    } else {
      return caractereLength;
    }
  }

  //Function : injection de toutes les publications dans la navigation

  getListPublications(): void {
    this.publicationsService.getAllPublications()
      .subscribe(responseData => {
        this.statusService.setstatus('Déconnection');
        this.publications = responseData;
        this.loading = false;
      })
  }

  //Function : recherche la publication cible

  getPublication(id: string): void {
    this.publicationsService.getOnePublication(id).subscribe(
    )
  }

  // Function : redirection de l'utilisateur vers la page de la publication cible

  onClickPublication(id: string) {
    this.getPublication(id)
    this.router.navigate(['publication', id])
  }


  // ------------------------ Like-Dislike --------------------------

  // Function: ajout like et supprime le dislike  et/ou supprime le like  

  onLiked(idPost: string): any {
    const objPost = new UserLiked(idPost);
    this.liked_dislikedService.postLiked(objPost)
      .subscribe(() => {
        this.publicationsService.getAllPublications()
          .subscribe(responseData => {
            this.publications = responseData;
          })
      });
  }

  // Function: ajout dislike et supprime le like  et/ou supprime le dislike  

  onDisliked(idPost: string): any {
    const objPost = new UserLiked(idPost);
    this.liked_dislikedService.postDisliked(objPost)
      .subscribe(() => {
        this.publicationsService.getAllPublications()
          .subscribe(responseData => {
            this.publications = responseData;
          })
      });
  }
}
