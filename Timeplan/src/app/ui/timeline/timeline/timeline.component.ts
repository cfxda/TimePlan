
import {Item} from '../../../items/shared/item';
import {ItemService} from '../../../items/shared/item.service';

import {Component, OnInit, Input} from '@angular/core';
import {FirebaseListObservable} from 'angularfire2/database';
import * as vis from 'vis'

import {ColorPickerModule} from 'angular4-color-picker';


@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
   
})


export class TimelineComponent implements OnInit {

  constructor(private itemSvc: ItemService) {}

   itemList: FirebaseListObservable<Item[]> = null; 
  
   timeline;

  showSpinner: boolean = true;

  public bgColor: string = "#127bdc";
  public fontColor: string = "#000";
  public brdColor: string = "#RRGGBBAA";
  

  
  
   container;
  
  save()
  {
    var supera= this.timeline.itemsData();
     }
  
  ngOnInit() {
    this.itemList = this.itemSvc.getItemsList()

    const  isTest='TRUE';
      // Create a DataSet (allows two way data-binding)

    var groups = new vis.DataSet();
    
    var options = {}; 

     var  visItemsList  = new vis.DataSet();
    
    
    var groupscount = 0;
    
   //^ if(isTest='')
    this.itemList.subscribe(
      item => {
        item.map(itemd => {

          var groupsid;

          var group2 = groups.get({
            fields: ['id'],
            filter: function(item) {
              return (item.content == itemd.group);
            }
          })
          if (group2.length != 0)
            groupsid = group2[0].id;
          else {
            groups.add({id: groupscount, content: itemd.group});
            groupsid = groupscount;
            groupscount++;
          }
          if ((typeof (itemd.stopDate) != "undefined") || (typeof (itemd.stopDate) != "undefined")) //, className: itemd.style
            visItemsList.update({id: itemd.$key, content: itemd.topic, start: itemd.startDate, end: itemd.stopDate, group: groupsid,style: itemd.style})
          else
           visItemsList.update({id: itemd.$key, content: itemd.topic, start: itemd.startDate, end: itemd.stopDate, group: groupsid, type: 'point',style: itemd.style})

        })
      });

    
    //necessary since this  is not working in the event
       var del = this.deleteItem.bind(this)
      var upd = this.itemList.update.bind(this)
    var self = this;
        // Configuration for the Timeline
     options = {

      editable: true,
      autoResize: true,
      onRemove: function(item, callback) {
   
        del(item.key)
        callback(item)
      },
       onMove: function(item, callback) {
   
        upd(item,{startDate: item.start,stopDate: item.start})
        callback(item)
      },

      margin: {
        item: 20
      }
    }
    
   this.container= document.getElementById('visualization');
    // Create a Timeline
     this.timeline = new vis.Timeline(this.container, visItemsList, options);
    
    this.timeline.setGroups(groups);
    
                    
    
    this.timeline.on('doubleClick', function(properties) {

      const bgColor = (<HTMLInputElement>document.getElementById('bgColor')).value;
      const fontColor = (<HTMLInputElement>document.getElementById('fontColor')).value;
      const brdColor = (<HTMLInputElement>document.getElementById('brdColor')).value;
      
      var colorC = "color:" + fontColor + ";background-color:" + bgColor + "; border-color:" + brdColor + "; dot-color:" + brdColor + ";" //for now boarder color => transparent

//visItemsList.update({id: properties.item, style: colorC})
      
    var item=  visItemsList.get(properties.item);
           self.itemSvc.updateItem(item.id,{ style: colorC})
     
    });
  

  }
deleteItem (key: string)
  {
  this.itemSvc.deleteItem(key);
}
 
   
 





}

