import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private userId: number;
  private token: string;
  private admin: number;

  private userCookies: string;
  private adminCookies: string;





  constructor(private cookieService: CookieService) { }

  //------------------------------ Cryptage des éléments avant le transfert des cookies dans le flux ------------------------------

  // Cryptage en lettre 

  private numberInString(variableNumber) {

    const entityAlphabet =
    {
      1: "A",
      2: "B",
      3: "C",
      4: "D",
      5: "E",
      6: "F",
      7: "G",
      8: "H",
      9: "I",
      0: "J",
    }

    // transforme le nombre en lettre

    function transformInString(variableNumber) {
      return String(variableNumber).replace(/[\d]/g, function (s) {
        return entityAlphabet[s];
      })
    }

    // Renvoie la valeur transformer

    return transformInString(variableNumber);
  }

  //------------------------------ Affichage des éléments cryptés dans le flux des cookies ------------------------------
  // User

  getUser(userId: any) {
    return this.cookieService.set('cookUstensile', this.numberInString(userId), { expires: 1 });
  }

  // Token

  getToken(token: any) {
    return this.cookieService.set('cookThail', token, { expires: 1 });
  }

  // Role Admin

  getAdmin(admin: any) {
    return this.cookieService.set('cookAnanas', this.numberInString(admin), { expires: 1 });
  }

  //------------------------------ Cryptage des éléments après le transfert des cookies dans le flux ------------------------------

  // Cryptage en nombre 

  private stringInNumber(variableString) {

    const entityAlphabet =
    {
      "A": 1,
      "B": 2,
      "C": 3,
      "D": 4,
      "E": 5,
      "F": 6,
      "G": 7,
      "H": 8,
      "I": 9,
      "J": 0
    }

    // transforme la lettre en nombre

    function transformInString(variableString) {
      return String(variableString).replace(/[A-Z]/g, function (s) {
        return entityAlphabet[s];
      })
    }

    // Renvoie la valeur transformer

    return transformInString(variableString);
  }

  //------------------------------ Retourne les éléments décryptés des cookies dans la navigation  ------------------------------
  // User

  getUserCookie() {
    this.userCookies = this.stringInNumber(this.cookieService.get('cookUstensile'));
    return Number(this.userCookies);

  }

  // Token

  getTokenCookie() {
    return this.cookieService.get('cookThail');
  }

  // Role Admin

  getAdminCookie() {
    this.adminCookies = this.stringInNumber(this.cookieService.get('cookAnanas'));
    return Number(this.adminCookies);
  }

  // Supprime les cookies

  deleteCookiesAll() {
    this.cookieService.delete('cookUstensile');
    this.cookieService.delete('cookThail');
    this.cookieService.delete('cookAnanas');
  }
}
