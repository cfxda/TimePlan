import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../core/auth.service";
import { TimelineComponent } from '../timeline/timeline/timeline.component';
@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {


  constructor(public auth: AuthService,public Timeline:TimelineComponent) { }

  ngOnInit() {
  }

  logout() {
    this.auth.signOut();
  }

}
