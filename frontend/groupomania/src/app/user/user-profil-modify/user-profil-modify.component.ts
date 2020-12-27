import { UserProfil } from '../../models/UserProfil..model';
import { UserService } from './../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.loading = true;
    this.userService.getProfilUser().subscribe(
      (profilUserFind) => {
        this.profilUser = profilUserFind;
        this.onInitImgProfilForm();
        this.loading = false;
      }
    )
  }

  // Check Value 
  onInitImgProfilForm(): any {
    this.profilForm = this.formBuilder.group({
      image: [null, [Validators.required]],
    })
    this.imagePreview = this.profilUser.image;

  }

  // While edit publication
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