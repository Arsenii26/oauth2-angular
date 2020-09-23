import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {User} from '../../models/user';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL, ACCESS_TOKEN } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  aaa = GOOGLE_AUTH_URL;
  bbb = FACEBOOK_AUTH_URL;
  ccc = GITHUB_AUTH_URL;

  user: User = new User();
  errorMessage: string;
  isLoading = false;
// create instance + router(to navigate page)
  constructor(private userService: UserService, private router: Router) { }

  // if user exists then redirect to profile page
  ngOnInit() {
    // console.log('Service: ' + this.userService.getUrlParameter('token'));
    if (this.userService.getUrlParameter('token')) {
      localStorage.setItem(ACCESS_TOKEN, JSON.stringify(this.userService.getUrlParameter('token')));  // HERE ISSUE
      // this.currentUserSubject.next(this.getUrlParameter('token'));
      this.router.navigate(['/user-account']);
    } else if (JSON.parse(localStorage.getItem(ACCESS_TOKEN))) {
      this.userService.autoLogin();
      this.router.navigate(['/user-account']);
      return;
    }
    // else {
    //   this.router.navigate(['/login']);
    //   return;
    // }
  }


  login() {
    console.log(this.user);
    this.isLoading = true; // start loading spinner
    this.userService.login(this.user).subscribe(data => {
    // this.userService.login(this.email, this.password).subscribe(data => {
      this.isLoading = false; // stop loading spinner
      this.router.navigate(['/user-account']);
      // location.reload();
    }, err => {
      this.isLoading = false;
      // Or your account was disabled
      this.errorMessage = 'Username or password is incorrect.\nOr your account wasn\'t activated';
    });
  }

}
