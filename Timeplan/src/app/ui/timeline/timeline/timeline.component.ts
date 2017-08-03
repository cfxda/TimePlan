import { Item } from '../../../items/shared/item';
import { ItemService } from '../../../items/shared/item.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseListObservable } from 'angularfire2/database';
import * as vis from 'vis'



@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})


export class TimelineComponent implements OnInit {

  itemsList: FirebaseListObservable<Item[]>;

  showSpinner: boolean = true;


  constructor(private itemSvc: ItemService) { }

  ngOnInit() {
    this.itemsList = this.itemSvc.getItemsList({limitToLast: 5})
    this.itemsList.subscribe(() => this.showSpinner = false)

    let container = document.getElementById('visualization');

    // Create a DataSet (allows two way data-binding)
    const items = new vis.DataSet();

this.itemsList.subscribe(
    item => {
        item.map(itemd =>
 items.add({ content: itemd.topic, start:  itemd.startDate, end: itemd.stopDate,className: red } )
    )});
    // Configuration for the Timeline
    const  options = {
  width: '100%',
  height: '400px',
  margin: {
    item: 20
  }
  }
    // Create a Timeline
     const timelined = new vis.Timeline(container, items, options);
  }

}
