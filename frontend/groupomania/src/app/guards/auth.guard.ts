import { SessionService } from './../services/cookies.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private authToken: string;

  constructor(private auth: AuthService,
    private router: Router,
    private sessionService: SessionService) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return Observable.create(
      (observer) => {
        this.authToken = this.sessionService.getTokenCookie();
        //Vérification du token de l'utilisateur soit via le cookie soit via en direct
        if (this.authToken) {
          observer.next(true);
        } else {
          this.auth.isAuth$.subscribe(
            (auth) => {
              if (auth) {
                observer.next(true);
              } else {
                this.router.navigate(['/login']);
              }
            }
          );
        }

      }
    );
  }
}

