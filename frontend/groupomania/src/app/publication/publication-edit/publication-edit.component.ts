import { PublicationService } from './../../services/publication.service';
import { Publication } from './../../models/Publication.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-publication-edit',
  templateUrl: './publication-edit.component.html',
  styleUrls: ['./publication-edit.component.scss'],
})
export class PublicationEditComponent implements OnInit {

  publicationForm: FormGroup;
  loading: boolean;
  mode: string;
  publication: Publication;
  formData = new FormData();
  imagePreview: string;
  msgErr: string;


  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private publicationService: PublicationService,
    private statusService: StatusService,) { }

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe(
      (params) => {
        this.statusService.setstatus('Déconnection');
        if (!params.id) {
          this.mode = 'new';
          this.onInitPublicationForm();
          this.loading = false;
        } else {
          this.mode = "modify";
          this.publicationService.getOnePublication(params.id).subscribe(
            (publication: Publication) => {
              this.publication = publication;
              this.initModifyForm(publication);
              this.loading = false;
            }
          )
        }
      }
    )
  }

  // Vérification des inputs dès le démarrage de la page

  onInitPublicationForm(): any {
    this.publicationForm = this.formBuilder.group({
      title: new FormControl(null, [Validators.required]),
      image: [null, [Validators.required]],
      description: new FormControl(null, [Validators.required])
    });
  }

  initModifyForm(publication: Publication): void {
    this.publicationForm = this.formBuilder.group({
      title: new FormControl(this.publication.title, [Validators.required]),
      image: [this.publication.imageUrl, [Validators.required]],
      description: new FormControl(this.publication.description, [Validators.required])
    });
    this.imagePreview = this.publication.imageUrl;
  }

  // Fonction liée au bouton de confirmation d'envoies des données saisis par l'utilisateur

  onSumitForm(): void {
    this.loading = true;
    const newValue = {
      title: this.publicationForm.get('title').value,
      description: this.publicationForm.get('description').value,
    };

    // Préparation de la requête en transformant les données saisis de l'utilisateur 

    const newPublication = new Publication(
      null,
      newValue.title,
      newValue.description,
      null
    );
    this.formData.append('image', this.publicationForm.get('image').value);
    this.formData.append('title', newPublication.title);
    this.formData.append('description', newPublication.description);

    // Envoie de la requête au serveur via la route API post publication

    if (this.mode === 'new') {
      this.publicationService.createPublication(this.formData).subscribe(
        () => {
          this.loading = false;
          this.router.navigate(['/accueil']);
        },
        error => this.msgErr = error.error.message
      )
      // Envoie de la requête au serveur via la route API modify publication

    } else if (this.mode === "modify") {
      this.publicationService.modifyPublication(this.publication.id, this.formData).subscribe(
        () => {
          this.loading = false;
          this.router.navigate(['/accueil']);
        },
        error => this.msgErr = error.error.message
      )
    }
  }

  // Function : modification du file

  uploadFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.publicationForm.get('image').setValue(file);
    this.publicationForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

}
