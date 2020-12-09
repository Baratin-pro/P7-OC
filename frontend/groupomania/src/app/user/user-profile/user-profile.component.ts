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
  constructor(private auth: AuthService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.onfetchUser();
  }

  onfetchUser(): any {
    /* this.userId = this.auth.
    this.loading = true;
    this.route.params */

  }
}
