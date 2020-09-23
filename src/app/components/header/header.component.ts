import { Component, OnInit } from '@angular/core';
import {ACCESS_TOKEN, UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {User} from '../../models/user';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // currentUser: User;
  currentUser: string; // token only
  constructor(private userService: UserService,
              private router: Router) {
    // this.userService.autoLogin();
    this.userService.currentUser.subscribe(data => {
      // HERE THE REFRESH HEADER COMPONENTS WITH Oauth2
      if (data !== null) {
        this.currentUser = data;
      } else {
        this.currentUser = null;
      }
    });

  }

  ngOnInit(): void {

  }

  logOut() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
