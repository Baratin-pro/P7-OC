import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User.model';
import { BehaviorSubject } from 'rxjs';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  loading: boolean;
  errMsg: string;

  // Identification

  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken: string;
  private userId: string;
  msgErr: string;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private statusService: StatusService) { }

  ngOnInit(): void {
    this.statusService.setstatus('Se connecter');
    this.onSignupForm();
  }

  // Vérification des inputs dès le démarrage de la page

  onSignupForm(): any {
    this.signupForm = this.formBuilder.group({
      emails: new FormControl(null,
        [Validators.required,
        Validators.email]),
      passwords: new FormControl(null,
        [Validators.required,
        Validators.minLength(8),
        Validators.pattern('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,100}')]),
      firstnames: new FormControl(null,
        [Validators.required,
        Validators.pattern('^[a-zA-Z]+[^&><"\'=/!£$]+(([-][a-zA-Z ])?[a-zA-Z]*)*$')]),
      names: new FormControl(null,
        [Validators.required,
        Validators.pattern('^[a-zA-Z]+[^&><"\'=/!£$]+(([-][a-zA-Z ])?[a-zA-Z]*)*$')])
    });
  }
  // Fonction liée au bouton de confirmation d'envoies des données saisis par l'utilisateur

  onSumitForm(): void {
    this.loading = true;

    // Récupération des valeurs 

    const userValue = {
      emails: this.signupForm.get('emails').value,
      passwords: this.signupForm.get('passwords').value,
      firstnames: this.signupForm.get('firstnames').value,
      names: this.signupForm.get('names').value
    }

    // Préparation de la requête en transformant les données saisis de l'utilisateur

    const newUser = new User(
      userValue.passwords,
      userValue.names,
      userValue.firstnames,
      userValue.emails
    )

    /* 
    *  Envoie de la requête au serveur pour la création de l'utilisateur via la route API signup
    *  Puis connecte directement ce dernier au serveur et l'envoie sur la page d'accueil 
    */
    this.authService.createUser(newUser)
      .subscribe(
        () => {
          this.authService.loginUser(newUser.emails, newUser.passwords)
            .subscribe(() => {
              this.isAuth$.next(true);
              this.router.navigate(['/accueil']);
            },
              error => this.msgErr = error.error.message

            )
          this.loading = false;
        },
        error => this.msgErr = error.error.message
      )
  }
}




