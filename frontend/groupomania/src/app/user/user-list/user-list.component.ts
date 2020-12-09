import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from './../../models/User.model';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {

  userSub: Subscription;
  users: [];
  loading: boolean = true;
 // errMsg: string;
  erreur: boolean = false;

  constructor(private userService : UserService) { }

  ngOnInit(): void {
    //this.onFetchUsers();
    this.getListUsers();
  }

  getListUsers() : void {
    this.userService.getAllUsers()
      //.pipe(takeUntil())
      .subscribe( responseData => {
        this.users = responseData;
        this.loading = false;
        }
      )//erreur
    }

  // The functions
/*   onFetchUsers(): any {
    this.loading = true;
    this.userSub = this.authService.users$.subscribe(
      (users) => {
        this.users = users;
        this.loading = false;
        this.errMsg = null;
      },
      (err) => {
        this.errMsg = JSON.stringify(err);
        this.loading = false;
      }
    );
    this.authService.fetchAllUser();
  } */
}
