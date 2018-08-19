import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class AuthGuardService implements CanActivate {
 
  constructor(public auth: AuthService, public router: Router, private http: Http) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}