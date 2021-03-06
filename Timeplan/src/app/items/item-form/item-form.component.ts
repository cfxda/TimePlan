import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Item } from '../shared/item';
import { ItemService } from '../shared/item.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {

  item: Item = new Item();
  constructor(public itemSvc: ItemService) { }

   

  
  ngOnInit() {
    //Set start date today
      this.item.startDate =new Date();
    

  }

  createItem() {
 
 
 
 
    this.itemSvc.createItem(this.item)
    this.item = new Item() // reset item
          this.item.startDate =new Date();
    
  }

}
