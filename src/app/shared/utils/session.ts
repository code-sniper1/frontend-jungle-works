import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Session {
  constructor(private cookieService: CookieService) {}

  getToken(): boolean {
    if (this.cookieService.get('access_token')) return true;
    else return false;
  }
}
