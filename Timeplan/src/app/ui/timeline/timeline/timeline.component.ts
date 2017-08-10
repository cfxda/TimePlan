import { Item } from '../../../items/shared/item';
import { ItemService } from '../../../items/shared/item.service';

import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import * as vis from 'vis'



@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})


export class TimelineComponent implements OnInit {

  
    constructor(private itemSvc: ItemService) { }
  
  itemsList: FirebaseListObservable<Item[]>;

  showSpinner: boolean = true;

 

  
  ngOnInit() {
    this.itemsList = this.itemSvc.getItemsList()

    const container = document.getElementById('visualization');

    // Create a DataSet (allows two way data-binding)
    const items = new vis.DataSet();

  var groups = new vis.DataSet();
 

var groupscount=0;
this.itemsList.subscribe(
    item => {
        item.map(itemd =>
          {
          
        var groupsid;
          
          var group2 = groups.get({ fields: ['id'],
  filter: function (item) {
    return (item.content == itemd.group);
  }
})
if( group2.length != 0)
 groupsid= group2[0].id;
else
  {
  groups.add({id: groupscount, content: itemd.group});
   groupsid= groupscount;
          groupscount++;
          }
if((typeof(itemd.stopDate) != "undefined")||(typeof(itemd.stopDate) != "undefined")) //, className: itemd.style
           items.add({key:itemd.$key, content: itemd.topic, start:  itemd.startDate, end: itemd.stopDate , group: groupsid} )
          else
                     items.add({key:itemd.$key, content: itemd.topic, start:  itemd.startDate, end: itemd.stopDate, group: groupsid, type: 'point'} )
          
    })});
    // Configuration for the Timeline
    var  options = {
 
  editable: true,
     autoResize: true,
  onRemove:  function (item ,callback) {
    alert("test")
    
    callback(item)
           },
     
  margin: {
    item: 20
  }
    }
    
    // Create a Timeline
     const timelined = new vis.Timeline(container, items, options);

  timelined.setGroups(groups);
  }
  
  
}


