import { UserLiked } from './../../models/User_liked.model';
import { Router } from '@angular/router';
import { Liked_dislikedService } from './../../services/liked_disliked.service';
import { PublicationService } from './../../services/publication.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-publication-list',
  templateUrl: './publication-list.component.html',
  styleUrls: ['./publication-list.component.scss']
})
export class PublicationListComponent implements OnInit {

  publicationSub: Subscription;
  publications: [];
  loading: boolean;
  errMsg: string;
  liked: boolean = true;
  disliked: boolean = true;
  idPublications: string;

  constructor(private publicationsService: PublicationService, private liked_dislikedService: Liked_dislikedService, private router: Router) { }

  ngOnInit(): void {
    this.getListPublications();

  }

  //Function action
  onDescriptionlength(caractereLength): string {
    if (caractereLength.length > 250) {
      return caractereLength.slice(0, 250) + " [...]";
    } else {
      return caractereLength;
    }
  }

  //Request
  getListPublications(): void {
    this.publicationsService.getAllPublications()
      .subscribe(responseData => {
        this.publications = responseData;
        console.log('publications:', this.publications)
        this.loading = true;
      })
  }
  getPublication(id: string): void {
    this.publicationsService.getOnePublication(id).subscribe(
    )
  }

  onClickPublication(id: string) {
    this.getPublication(id)
    this.router.navigate(['publication', id])
  }

  onLiked(id): any {
    id = new UserLiked(id);
    if (this.liked = true) {
      this.liked_dislikedService.postLiked(id).subscribe(
      )
      this.liked = false;
      return this.liked
    } else if (this.liked = false) {
      this.liked_dislikedService.deleteLiked(id).subscribe(
      )
      return this.liked = true;
    }
  }

  onDisliked(id): any {
    id = new UserLiked(id);
    if (this.disliked = true) {
      this.liked_dislikedService.postDisliked(id).subscribe(
      )
      return this.disliked = false;
    } else if (this.disliked = false) {
      this.liked_dislikedService.deleteDisliked(id).subscribe(
      )
      return this.disliked = true;
    }
  }

}
