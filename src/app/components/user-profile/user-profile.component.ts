import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {UserService} from '../../services/user.service';
import {UserJson} from '../../models/userJson';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  subscription: Subscription;
  // currentUser: User;
  currentUser: UserJson; // to display needed the JSON data for user

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.subscription = this.userService.findUser().subscribe(data => {
      this.currentUser = data;
    });
  }

}
