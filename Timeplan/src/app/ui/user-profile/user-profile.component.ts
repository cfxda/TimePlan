import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../core/auth.service";
import { ItemService } from '../../items/shared/item.service';
import { Location } from '@angular/common';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
  
  
export class UserProfileComponent implements OnInit {

  public  color : String;

 
  constructor(public auth: AuthService, public itemSvc: ItemService, public Location: Location) { }

 
  
  ngOnInit() {
  }

  logout() {
    this.auth.signOut();
  }

}
