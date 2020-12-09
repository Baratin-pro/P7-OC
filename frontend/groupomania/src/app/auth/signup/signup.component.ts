import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit  {

  signupForm: FormGroup;
  loading: boolean;
  errMsg: string;

  // Identification

  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken: string;
  private userId: string;
  
  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {}

 ngOnInit(): void {
   this.onSignupForm();
  }

  // Check value
  onSignupForm(): any {
    this.signupForm  = this.formBuilder.group({
      emails: new FormControl (null, [Validators.required, Validators.email]),
      passwords: new FormControl(null,  [Validators.required, 
                                        Validators.minLength(8), Validators.pattern('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,100}')]),
      firstnames: new FormControl (null, [Validators.required, Validators.pattern('^[a-zA-Z]+[^&><"\'=/!£$]+(([-][a-zA-Z ])?[a-zA-Z]*)*$')]), 
      names: new FormControl (null, [Validators.required, Validators.pattern('^[a-zA-Z]+[^&><"\'=/!£$]+(([-][a-zA-Z ])?[a-zA-Z]*)*$')])
    });
  }
   // While signup
  onSumitForm(): void{
   
    this.loading = true;

    // Recovery value
    const userValue = {
      emails: this.signupForm.get('emails').value,
      passwords: this.signupForm.get('passwords').value,
      firstnames: this.signupForm.get('firstnames').value,
      names:  this.signupForm.get('names').value
    }
  
    // Recovery model User
    const newUser = new User(
      userValue.passwords,
      userValue.names,
      userValue.firstnames,
      userValue.emails
    )

    // Function: create User then login him
    this.authService.createUser(newUser)
    .subscribe(
      (response: { message: string }) => {
        console.log(response.message);
        this.authService.loginUser(newUser.emails, newUser.passwords)
        .subscribe(
          (response: {userId: string, token: string} ) => {
            this.userId = response.userId;
            this.authToken = response.token;
            this.isAuth$.next(true);
            this.loading = false;
            this.router.navigate(['/accueil']);
          }
        )
      }
    )
  }
}




