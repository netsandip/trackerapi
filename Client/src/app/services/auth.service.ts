// import { JwtHelper } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
// import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable()
export class AuthService {
  Username: string;
  serverURL: any;
    constructor(private http: Http) {
      //this.serverURL = 'https://apitrackergps.herokuapp.com';
      this.serverURL = 'http://ec2-13-232-177-192.ap-south-1.compute.amazonaws.com:3001';
  }

   // Add user / Registration Service
validateUser(userDetails) {
  const headers = new Headers();
      // headers.append('userid', 'userid');
      // headers.append('password', 'password');
          headers.append('Content-Type', 'application/json');
          return this.http.post(this.serverURL + '/validateLogin', userDetails, { headers: headers })
              .map(res => res.json());
  }

isLoggedIn(): boolean {
  return localStorage.getItem('currentUser') !== null;
}

logOut() {
  localStorage.clear();
  sessionStorage.clear();
}

getUserName() {
  return localStorage.getItem('currentUser');
}

storeUsersData(token, user) {
      localStorage.setItem('id_token', token); // JWT look directly for this in local storage
      localStorage.setItem('currentUser', user);

  }


  // ...
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    //return !this.jwtHelper.isTokenExpired(token);
    return true;
  }

}
