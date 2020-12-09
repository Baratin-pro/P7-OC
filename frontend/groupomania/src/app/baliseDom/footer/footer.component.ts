import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
 mobile: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.widthCalcul();
  }

  widthCalcul(): any {
    if (screen.width < 700){
      this.mobile = true;
    }
    else { this.mobile = false;
    }
  }


}
