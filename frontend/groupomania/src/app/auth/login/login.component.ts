import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading: boolean;
  errMsg: string;

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.onLoginForm();
  }

  onLoginForm(): any{
    this.loginForm = this.formBuilder.group({
      emails: [null, [Validators.required, Validators.email]],
      passwords: [null, Validators.required]
    });
  }

  onLogin(): any{
    this.loading = true;
    const emails = this.loginForm.get('emails').value;
    const passwords = this.loginForm.get('passwords').value;
    this.auth.loginUser(emails, passwords).subscribe(
      () => {
        this.loading = false;
        this.router.navigate(['/accueil']);
      }
    )
  }
}
