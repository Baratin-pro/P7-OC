import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from '../services/cookies.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private sessionService: SessionService, private cookieService: CookieService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authToken;
    if (this.cookieService.check('cookThail')) {
      authToken = this.sessionService.getTokenCookie();
    } else {
      authToken = '';
    }
    const newRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    return next.handle(newRequest);
  }
}