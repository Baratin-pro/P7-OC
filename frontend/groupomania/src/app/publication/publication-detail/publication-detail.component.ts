import { CommentService } from './../../services/comment.service';
import { AuthService } from './../../services/auth.service';
import { PublicationService } from './../../services/publication.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-publication-detail',
  templateUrl: './publication-detail.component.html',
  styleUrls: ['./publication-detail.component.scss']
})
export class PublicationDetailComponent implements OnInit {

  publication: [];
  loading: boolean;
  errMsg: string;
  liked: boolean = true;
  disliked: boolean = true;
  idPublications: string;
  userId: string;

  commentForm: FormGroup;

  constructor(private publicationsService: PublicationService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private commentService: CommentService) { }

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe(
      (params) => {
        this.publicationsService.getOnePublication(params.id)
          .subscribe((publication) => {
            this.publication = publication;
            console.log('publication:', this.publication)
            this.onInitComment();
            this.loading = false;
          }
          )
      })
    this.userId = this.authService.getUserId();
    console.log(this.userId)
  }

  deletePublication(id: string): void {
    this.publicationsService.deletePublication(id).subscribe(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = true;
        this.router.navigate(['/accueil']);
      }
    )
  }
  modifyPublication(id: string): void {
    this.router.navigate(['/modify-publication' + "/" + id])
  }

  //Function action 
  onDescriptionlength(caractereLength): string {
    if (caractereLength.length > 250) {
      return caractereLength.slice(0, 250) + " [...]";
    } else {
      return caractereLength;
    }
  }

  // ------------------------ Comment --------------------------

  // Check value
  onInitComment(): any {
    this.commentForm = this.formBuilder.group({
      comments: new FormGroup(null, [Validators.required])
    });
  }
  // While edit publication
  onSumitForm(idPublication: string): void {
    this.loading = true;
    const newComments = this.commentForm.get('comments').value;
    this.commentService.createComment(idPublication, newComments).subscribe(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        this.router.navigate(['/accueil']);
      })
  }
}
