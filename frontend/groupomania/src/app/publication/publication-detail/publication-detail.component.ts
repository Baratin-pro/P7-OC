import { PublicationService } from './../../services/publication.service';


import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-publication-detail',
  templateUrl: './publication-detail.component.html',
  styleUrls: ['./publication-detail.component.scss']
})
export class PublicationDetailComponent implements OnInit {

  constructor(private publicationsService: PublicationService ) { }

  ngOnInit(): void {
  }


}
