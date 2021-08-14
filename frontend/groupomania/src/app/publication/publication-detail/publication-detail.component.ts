import { Comment } from './../../models/Comment.model';
import { CommentService } from './../../services/comment.service';
import { AuthService } from './../../services/auth.service';
import { PublicationService } from './../../services/publication.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PublicationCommentModifyComponent } from '../publication-comment-modify/publication-comment-modify.component';
import { UserLiked } from 'src/app/models/User_liked.model';
import { Liked_dislikedService } from 'src/app/services/liked_disliked.service';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-publication-detail',
  templateUrl: './publication-detail.component.html',
  styleUrls: ['./publication-detail.component.scss'],
})
export class PublicationDetailComponent implements OnInit {

  publication: [];
  comments: [];
  loading: boolean;
  errMsg: string;
  liked: boolean = true;
  disliked: boolean = true;
  idPublications: string;
  private userId: number;
  private admin: number;

  commentForm: FormGroup;

  constructor(private publicationsService: PublicationService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private commentService: CommentService,
    public dialog: MatDialog,
    private liked_dislikedService: Liked_dislikedService,
    private statusService: StatusService,


  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe(
      (params) => {

        // Affichage de la publication 

        this.publicationsService.getOnePublication(params.id)
          .subscribe((publication) => {
            this.statusService.setstatus('Déconnection');
            this.publication = publication;
            this.onInitComment();
            this.loading = false;
          }
          )

        // Affichage des commentaires

        this.commentService.getAllComments(params.id)
          .subscribe((commentAll) => {
            this.comments = commentAll;
            this.loading = false;
          }
          )
      })

    //  Injection de l'user.ID et du user.role

    this.userId = this.authService.getUserId();
    this.admin = this.authService.getAdmin();
  }

  // ------------------------ Publication --------------------------

  // Function: suppression de la publication cible

  deletePublication(id: string): void {
    this.publicationsService.deletePublication(id).subscribe(
      (response: { message: string }) => {
        this.loading = true;
        this.router.navigate(['/accueil']);
      }
    )
  }

  // Function: modification de la publication cible

  modifyPublication(id: string): void {
    this.router.navigate(['/modify-publication' + "/" + id])
  }

  // ------------------------ Comment --------------------------

  // Vérification des inputs dès le démarrage de la page

  onInitComment(): any {
    this.commentForm = this.formBuilder.group({
      comment: new FormControl(null, [Validators.required])
    });
  }
  // Fonction liée au bouton de confirmation d'envoies des données saisis par l'utilisateur

  onSumitForm(id: number): void {

    // Récupération des valeurs 

    const newCommentsValue = this.commentForm.get('comment').value;

    // Préparation de la requête en transformant les données saisis de l'utilisateur 

    const newComment = new Comment(
      id,
      newCommentsValue,

    )

    // Envoie de la requête au serveur via la route API post comment

    this.commentService.createComment(newComment).subscribe(
      () => {

        // Retorune les nouvelles données à la navigation

        this.commentService.getAllComments(String(id)).subscribe(
          (commentAll) => {
            this.comments = commentAll;
            this.commentForm = this.formBuilder.group({
              comment: new FormControl(null)
            });

            // Actualise le nombre de commentaires publiés sur la publication cible

            this.publicationsService.getOnePublication(String(id)).subscribe(
              (commentAll) => {
                this.publication = commentAll;
              }
            )
          }
        )
      })
  }

  // Function: suppression du commentaire cible

  deleteComment(id: string, idPublicationFocus: number): void {
    this.commentService.deleteComment(id).subscribe(
      () => {
        this.publicationsService.getOnePublication(String(idPublicationFocus))
        this.commentService.getAllComments(String(idPublicationFocus)).subscribe(
          (commentAll) => {
            this.comments = commentAll;
            this.publicationsService.getOnePublication(String(idPublicationFocus)).subscribe(
              (commentAll) => {
                this.publication = commentAll;
              })
          }
        )
      }
    )
  }

  // Function: modifcation de la publication cible

  modifyComment(idCommentFocus: string, idPublicationFocus: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      idComment: idCommentFocus,
      idPublication: idPublicationFocus
    };
    const dialogRef = this.dialog.open(PublicationCommentModifyComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.commentService.getAllComments(String(idPublicationFocus)).subscribe(
        (commentAll) => {
          this.comments = commentAll;
        }
      )
    })
  }

  // ------------------------ Like-Dislike --------------------------

  // Function: ajout like et supprime le dislike  et/ou supprime le like  
  onLiked(idPost: string): any {
    const objPost = new UserLiked(idPost);
    this.liked_dislikedService.postLiked(objPost)
      .subscribe(() => {
        this.publicationsService.getOnePublication(idPost)
          .subscribe(responseData => {
            this.publication = responseData;
          })
      });
  }

  // Function: ajout dislike et supprime le like  et/ou supprime le dislike  

  onDisliked(idPost: string): any {
    const objPost = new UserLiked(idPost);
    this.liked_dislikedService.postDisliked(objPost)
      .subscribe(() => {
        this.publicationsService.getOnePublication(idPost)
          .subscribe(responseData => {
            this.publication = responseData;
          })
      });
  }
}
