import { User } from 'src/app/models/User.model';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading: boolean;
  errMsg: string;

  // Identification

  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken: string;
  private userId: string;

  constructor(private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.onLoginForm();
  }

  onLoginForm(): any {
    this.loginForm = this.formBuilder.group({
      emails: new FormControl(null,
        [Validators.required,
        Validators.email]),
      passwords: new FormControl(null,
        [Validators.required,
        Validators.pattern('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,100}')])
    })
  }
  onSumitForm(): any {
    this.loading = true;

    // Recovery value
    const userValue = {
      emails: this.loginForm.get('emails').value,
      passwords: this.loginForm.get('passwords').value,
    }

    const userLogin = new User(
      userValue.passwords,
      null,
      null,
      userValue.emails,
    )
    this.auth.loginUser(userLogin.emails, userLogin.passwords)
    this.loading = false;

  }
}

