import { UserProfilModifyComponent } from './../user-profil-modify/user-profil-modify.component';
import { UserService } from './../../services/user.service';
import { User } from './../../models/User.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  today: number = Date.now();
  users: User;
  userId: string;
  loading: boolean;
  profil: [];
  msgErr: string;

  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private statusService: StatusService,) { }

  ngOnInit(): void {
    this.getProfileUser()
  }

  // Injection de l'utilisateur dans la navigation

  getProfileUser(): void {
    this.userService.getProfilUser().subscribe(
      responseProfile => {
        this.statusService.setstatus('Déconnection');
        this.profil = responseProfile;
        this.loading = true;
      }
    )
  }

  // Function: suppression du compte de l'user cible

  deleteProfil(id: string): void {
    this.userService.deleteUser(id).subscribe(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        this.router.navigate(['/auth/login']);
      },
      error => this.msgErr = error.error.message
    )
  }

  // Function: modification du compte de l'user cible

  modifyImgProfil(): void {
    const dialogRef = this.dialog.open(UserProfilModifyComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.userService.getProfilUser().subscribe(
        responseProfile => {
          this.profil = responseProfile;
          console.log('profile', this.profil)
          this.loading = true;
        },
        error => this.msgErr = error.error.message
      )
    })
  }
}
