import { StatusService } from './../../services/status.service';
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
  msgErr: string;

  // Identification

  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken: string;
  private userId: string;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private statusService: StatusService) { }

  ngOnInit(): void {
    this.statusService.setstatus('Se connecter');
    this.onLoginForm();
  }

  // Vérification des inputs dès le démarrage de la page

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

  // Fonction liée au bouton de confirmation d'envoies des données saisis par l'utilisateur

  onSumitForm(): any {
    this.loading = true;

    // Récupération des valeurs 

    const userValue = {
      email: this.loginForm.get('emails').value,
      password: this.loginForm.get('passwords').value,
    }

    // Préparation de la requête en transformant les données saisis de l'utilisateur 

    const userLogin = new User(
      userValue.password,
      null,
      null,
      userValue.email,
    )

    // Envoie de la requête au serveur via la route API login

    this.authService.loginUser(userLogin.email, userLogin.password)
      .subscribe(() => {
        this.isAuth$.next(true);
        this.router.navigate(['/accueil']);
      },
        error => this.msgErr = error.error.message
      )
    this.loading = false;
  }
}

