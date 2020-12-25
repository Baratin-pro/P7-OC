import { UserService } from './../../services/user.service';
import { AuthService } from './../../services/auth.service';
import { User } from './../../models/User.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  errMsg: string;
  profil: [];

  constructor(private auth: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getProfileUser()
  }
  getProfileUser(): void {
    this.userService.getProfilUser().subscribe(
      responseProfile => {
        this.profil = responseProfile;
        console.log('profile', this.profil)
        this.loading = true;
      }
    )
  }

  deleteProfil(id: string): void {
    this.userService.deleteUser(id).subscribe(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        this.router.navigate(['/auth/login']);
      }
    )
  }
  modifyImgProfil(id: string): void {
    this.router.navigate(['modify-profile', id])
  }

}