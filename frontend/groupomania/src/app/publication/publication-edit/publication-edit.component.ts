import { PublicationService } from './../../services/publication.service';
import { Publication } from './../../models/Publication.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-publication-edit',
  templateUrl: './publication-edit.component.html',
  styleUrls: ['./publication-edit.component.scss']
})
export class PublicationEditComponent implements OnInit {

  publicationForm: FormGroup;
  loading: boolean;
  mode: string;
  publication: Publication;
  formData = new FormData();
  imagePreview: string;


  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private publicationService: PublicationService) { }

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe(
      (params) => {
        if (!params.id) {
          this.mode = 'new';
          this.onInitPublicationForm();
          this.loading = false;
        } else {
          this.mode = "modify";
          this.publicationService.getOnePublication(params.id).subscribe(
            (publication: Publication) => {
              this.publication = publication;
              this.initModifyForm();
              this.loading = false;
            }
          )
        }
      }
    )
  }
  // Check value
  onInitPublicationForm(): any {
    this.publicationForm = this.formBuilder.group({
      titles: new FormControl(null, [Validators.required]),
      image: [null, [Validators.required]],
      descriptions: new FormControl(null, [Validators.required])
    });

  }
  // While edit publication
  onSumitForm(): void {
    this.loading = true;
    const newValue = {
      titles: this.publicationForm.get('titles').value,
      descriptions: this.publicationForm.get('descriptions').value,
    };

    const newPublication = new Publication(
      newValue.titles,
      newValue.descriptions,
    );
    this.formData.append('image', this.publicationForm.get('image').value);
    this.formData.append('titles', newPublication.titles);
    this.formData.append('descriptions', newPublication.descriptions);


    if (this.mode === 'new') {
      this.publicationService.createPublication(this.formData).subscribe(
        (response: { message: string }) => {
          console.log(response.message);
          this.loading = false;
          this.router.navigate(['/accueil']);
        }
      )
    }
  }
  initModifyForm(): void { }
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
