import { PublicationService } from './../../services/publication.service';
import { Component, OnInit } from '@angular/core';
import { Publication } from 'src/app/models/Publication.model';
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

  constructor(private publicationsService: PublicationService ) { }
  ngOnInit(): void {
    this.getListPublications();
  }

  getListPublications(): void {
    this.publicationsService.getAllPublications()
    .subscribe(responseData => {
      this.publications = responseData;
      console.log('publications:', this.publications)
      this.loading = true;
    })
  }



}
