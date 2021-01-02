import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from './../../models/User.model';
import { AuthService } from 'src/app/services/auth.service';
import { StatusService } from 'src/app/services/status.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {

  userSub: Subscription;
  users: [];
  loading: boolean = true;
  erreur: boolean = false;
  private admin: number;

  constructor(private userService: UserService,
    private authService: AuthService,
    private statusService: StatusService,) { }

  ngOnInit(): void {
    this.getListUsers();
    this.admin = this.authService.getAdmin();
  }

  // Function : injection de la liste des utilisateurs membres
  getListUsers(): void {
    this.userService.getAllUsers()
      //.pipe(takeUntil())
      .subscribe(responseData => {
        this.statusService.setstatus('Déconnection');
        this.users = responseData;
        this.loading = false;
      }
      )
  }

  // Function: suppression du compte de l'user cible

  deleteUserFocus(idUserFocus: string): void {
    this.userService.deleteUser(idUserFocus).subscribe(
      (responseData: { message: string }) => {
        console.log(responseData.message);
        this.userService.getAllUsers().subscribe(
          (userAll) => {
            this.users = userAll;
          }
        )
      })
  }
}
