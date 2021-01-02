import { Comment } from './../../models/Comment.model';
import { CommentService } from 'src/app/services/comment.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-publication-comment-modify',
  templateUrl: './publication-comment-modify.component.html',
  styleUrls: ['./publication-comment-modify.component.scss']
})
export class PublicationCommentModifyComponent implements OnInit {

  loading: boolean;
  commentForm: FormGroup;
  formData = new FormData();
  imagePreview: string;
  comment: Comment;
  msgErr: string;

  constructor(private formBuilder: FormBuilder,
    private commentService: CommentService,
    private statusService: StatusService,
    @Inject(MAT_DIALOG_DATA) public data: { idComment: string, idPublication: string }
  ) { }

  ngOnInit() {
    this.getOneComment(this.data.idComment);
  }

  // Vérification des inputs dès le démarrage de la page

  onInitCommentForm(): any {
    this.commentForm = this.formBuilder.group({
      comments: new FormControl(this.comment.comments, [Validators.required]),
    })
  }

  // Affichage des données de la publication 

  getOneComment(idComment: string) {
    this.loading = true;
    this.commentService.getOneComment(idComment).subscribe(
      (comment: Comment) => {
        this.statusService.setstatus('Déconnection');
        this.comment = comment;
        this.onInitCommentForm();
        this.loading = false;
      })
  }

  // Fonction liée au bouton de confirmation d'envoies des données saisis par l'utilisateur

  onSumitForm(): void {

    // Récupération des valeurs 

    const newValue = this.commentForm.get('comments').value;

    // Préparation de la requête en transformant les données saisis de l'utilisateur     

    const newDescriptionComment = new Comment(
      null,
      newValue,
      null
    )

    // Envoie de la requête au serveur via la route API modify-publication

    this.commentService.modifyComment(this.comment.idComments, newDescriptionComment).subscribe(
      (response: { message: string }) => {
        console.log(response.message);
      },
      error => this.msgErr = error.error.message
    )
  }
}
