import { Component, OnInit } from '@angular/core';
import { StatusService } from '../services/status.service';

@Component({
  selector: 'app-four-oh-four',
  templateUrl: './four-oh-four.component.html',
  styleUrls: ['./four-oh-four.component.scss']
})
export class FourOhFourComponent implements OnInit {

  constructor(private statusService: StatusService) { }

  ngOnInit(): void {
    this.statusService.setstatus('Se connecter');
  }

}
