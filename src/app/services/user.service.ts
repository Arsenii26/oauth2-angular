import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../models/user';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginToken} from '../models/loginToken';

// const API_URL = 'http://localhost:8000/api/user/service/';
export const API_BASE_URL = 'http://localhost:8080';
export const ACCESS_TOKEN = 'accessToken';

export const OAUTH2_REDIRECT_URI = 'http://localhost:4200/oauth2/redirect';

export const GOOGLE_AUTH_URL = API_BASE_URL + '/oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const FACEBOOK_AUTH_URL = API_BASE_URL + '/oauth2/authorize/facebook?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const GITHUB_AUTH_URL = API_BASE_URL + '/oauth2/authorize/github?redirect_uri=' + OAUTH2_REDIRECT_URI;


@Injectable({
  providedIn: 'root'
})


export class UserService {

  public currentUser: Observable<string>;
  currentUserSubject: BehaviorSubject<string>;
  private loginToken: LoginToken;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.currentUserSubject = new BehaviorSubject<string>((localStorage.getItem(ACCESS_TOKEN))); // get current user from JSON
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): string {
    return this.currentUserSubject.value;
  }

  login(user: User): Observable<any> {

    return this.http.post<any>(API_BASE_URL + '/auth/login', JSON.stringify(user),
      {headers: {'Content-Type': 'application/json; charset=UTF-8'}}
      ).pipe(
      map(response => {
        if (response) {
          this.loginToken = response;
          localStorage.setItem(ACCESS_TOKEN, JSON.stringify(this.loginToken.accessToken));
          this.currentUserSubject.next(this.loginToken.accessToken);
        }
        return response;
      })
    );
  }


  // get logged in user if refreshed page
  autoLogin() {
    const userData: {
      token: string;
    } = JSON.parse(localStorage.getItem(ACCESS_TOKEN));
    console.log('autoLogin(here) ' + userData);
    // if user isn't active return nothing => redirect to home page
    console.log('autoLogin(userData) ' + userData);
    console.log('autoLogin(userData)2 ' + localStorage.getItem(ACCESS_TOKEN));
    if (!userData) {
      return;
    }
    // if user has valid token == user is logged in
    if (userData !== null) {
      // make current active user
      this.currentUserSubject.next(localStorage.getItem(ACCESS_TOKEN));  // HERERERE
    }
  }

  // send post request
  register(user: User): Observable<any> {
    return this.http.post(API_BASE_URL + '/auth/signup', JSON.stringify(user),
      {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }

  // findUser() {
  findUser(): Observable<any> {
    return this.http.get(API_BASE_URL + '/user/me',
      {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
  }


  logout() {
    localStorage.removeItem(ACCESS_TOKEN);
    this.currentUserSubject.next(null);
  }
  // find url params after login/register
  getUrlParameter(name) {
    // name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    // const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

    const results = this.route.snapshot.queryParamMap.get('token'); // get param from url
    // console.log('getUrlParameter ' + results);
    this.currentUserSubject.next(results);
    return results === null ? '' : decodeURIComponent(results.replace(/\+/g, ' '));
  }

}
