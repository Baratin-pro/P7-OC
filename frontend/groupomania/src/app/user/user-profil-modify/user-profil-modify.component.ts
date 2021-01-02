import { UserProfil } from '../../models/UserProfil..model';
import { UserService } from './../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-user-profil-modify',
  templateUrl: './user-profil-modify.component.html',
  styleUrls: ['./user-profil-modify.component.scss']
})
export class UserProfilModifyComponent implements OnInit {

  loading: boolean;
  profilForm: FormGroup;
  profilUser: UserProfil;
  formData = new FormData();
  imagePreview: string;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private statusService: StatusService,) { }

  ngOnInit(): void {
    this.loading = true;
    this.userService.getProfilUser().subscribe(
      (profilUserFind) => {
        this.statusService.setstatus('Déconnection');
        this.profilUser = profilUserFind;
        this.onInitImgProfilForm();
        this.loading = false;
      }
    )
  }

  // Vérification des inputs dès le démarrage de la page

  onInitImgProfilForm(): any {
    this.profilForm = this.formBuilder.group({
      image: [null, [Validators.required]],
    })
    this.imagePreview = this.profilUser.image;

  }

  // Fonction liée au bouton de confirmation d'envoies des données saisis par l'utilisateur

  onSumitForm(): void {
    this.loading = false;
    this.formData.append('image', this.profilForm.get('image').value);
    this.userService.modifyUser(this.formData).subscribe(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
      }
    )
  }

  // Function : modification du file

  uploadFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.profilForm.get('image').setValue(file);
    this.profilForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);

  }

}