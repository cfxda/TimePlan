import {Component, OnInit, Input} from '@angular/core';
import {ItemService} from '../shared/item.service';
import {Item} from '../shared/item';
import {FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2/database';
import {FormsModule} from '@angular/forms';
import {FormControl} from '@angular/forms';
import {DateAdapter, NativeDateAdapter} from '@angular/material';
//import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})

export class ItemsListComponent implements OnInit {

  items: FirebaseListObservable<Item[]>;
  itemFB: FirebaseObjectObservable<Item>;
  
  
 // uploader = new FileUploader({url: `YOUR URL`});
  
  showSpinner: boolean = true;
  
  public options = [];
  public myControl = new FormControl();

  item: Item = new Item();

  constructor(private itemSvc: ItemService, dateAdapter: DateAdapter<NativeDateAdapter>) {
    dateAdapter.setLocale('de-DE');
  }

  updateItem() {

    if (this.options.indexOf(this.item.group) == -1)
      this.options.push(this.item.group);


    this.itemSvc.updateItem(this.item.$key, this.item)
    this.item = new Item() // reset item
    this.item.startDate = new Date();

  }
  
    createItem() {

    if (this.options.indexOf(this.item.group) == -1)
      this.options.push(this.item.group);


    this.itemSvc.createItem(this.item)
    this.item = new Item() // reset item
    this.item.startDate = new Date();

  }
  ngOnInit() {
    this.item.startDate = new Date();

    this.items = this.itemSvc.getItemsList()
    this.items.subscribe(items => items.forEach(item => {if (this.options.indexOf(item.group) == -1) {this.options.push(item.group)} }))




  }


  deleteItems() {
    this.itemSvc.deleteAll()
  }
  
  dItem(key: string) {
    this.itemSvc.deleteItem(key)
  }
getItem(key: string)
  {
this.itemFB=  this.itemSvc.getItem(key);
   this.itemFB.subscribe(item => {this.item =  item;
this.item.startDate =new Date(item.startDate);
  this.item.stopDate =new Date(item.stopDate)
  })

}
  


}
