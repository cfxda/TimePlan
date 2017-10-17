import {Component, OnInit, Input} from '@angular/core';
import {ItemService} from '../shared/item.service';
import {Item} from '../shared/item';
import {FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {FormsModule} from '@angular/forms';
import {FormControl} from '@angular/forms';
import {DateAdapter, NativeDateAdapter} from '@angular/material';
import { Location } from '@angular/common';
import * as fileSaver from  'file-saver';

// import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})

export class ItemsListComponent implements OnInit {

  items: FirebaseListObservable<Item[]>;
  itemFB: FirebaseObjectObservable<Item>;
  
  
 // uploader = new FileUploader({url: `YOUR URL`});
  
  showSpinner = true;
  
  
  public myControl = new FormControl();

  item: Item = new Item();

  constructor(private itemSvc: ItemService, dateAdapter: DateAdapter<NativeDateAdapter>, public Location: Location) {
    dateAdapter.setLocale('de-DE');
  }

  updateItem() {

    if (this.item.group) {
    if (this.itemSvc.groupList.indexOf(this.item.group) == -1)
      this.itemSvc.groupList.push(this.item.group);
    }
   var itemT=  this.item;
    this.itemSvc.updateItem(this.item.$key, itemT)
    this.item =  new Item    
  
     }
  
    createItem() {  
      if(this.item.group)
      {
    if (this.itemSvc.groupList.indexOf(this.item.group) == -1)
      this.itemSvc.groupList.push(this.item.group);
      }

    this.itemSvc.createItem(this.item)
    this.item =  new Item();
    this.item.startDate = new Date();

  }
  ngOnInit() {
    this.item.startDate = new Date();
this.itemSvc.groupList = [];
    
    this.items = this.itemSvc.getItemsList()




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
this.itemFB.subscribe(itema => {this.item =  itema;
this.item.startDate =new Date(itema.startDate);
this.item.stopDate =new Date(itema.stopDate)
  })
  
}
  exportItems()
  {
    
    let x = document.getElementById('itemtable').innerHTML
   
      x.replace('<span _ngcontent-c7="" class="button">Edit</span>', 'd'); 
           x.replace('Delete', 'd'); 
    
          const blob = new Blob([x], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        });
    
           fileSaver.saveAs(blob, 'timeline.xls');

    
    
  }

  
  
  


}
