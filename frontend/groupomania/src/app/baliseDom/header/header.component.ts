import { AuthService } from 'src/app/services/auth.service';
import { StatusService } from './../../services/status.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title: string = 'groupomania';
  status: string = '';

  constructor(private statusService: StatusService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.statusService.status.subscribe(status => {
      this.status = status;
    })

  }

  deconnection(): void {
    this.authService.logout();
  }


}
