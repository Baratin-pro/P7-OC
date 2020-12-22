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
}
