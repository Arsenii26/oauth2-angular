import { Component, OnInit } from '@angular/core';
import {ACCESS_TOKEN, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL, GOOGLE_AUTH_URL, UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  aaa = GOOGLE_AUTH_URL;
  bbb = FACEBOOK_AUTH_URL;
  ccc = GITHUB_AUTH_URL;

  user: User = new User();
  errorMessage: string;
  isLoading = false;
// create instance + router(to navigate page)
  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private location: Location,
              private snackBar: MatSnackBar) { }

  // if user exists then redirect to profile page
  ngOnInit() {

    // console.log('Service: ' + this.userService.getUrlParameter('token'));
    if (this.userService.getUrlParameter('token')) {
      localStorage.setItem(ACCESS_TOKEN, JSON.stringify(this.userService.getUrlParameter('token')));  // HERE ISSUE
      this.router.navigate(['/user-account']);
    } else if (JSON.parse(localStorage.getItem(ACCESS_TOKEN))) {
      this.userService.autoLogin();
      this.router.navigate(['/user-account']);
      return;
    }
  }

  register() {
    this.errorMessage = '';
    this.isLoading = true;
    this.userService.register(this.user).subscribe(data => {
        const infoMessage = 'Successful! \nEmail been sent to your email to confirm!';
        this.openSnackBar(infoMessage);
        this.isLoading = false;
        this.location.replaceState('/'); // clears browser history so they can't navigate with back button
        this.router.navigate(['/login']);
      }, err => {
        console.log(err); // debug
        this.isLoading = false;
        this.errorMessage = 'Unexpected error: ' + err;
      }
    );
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }

}
