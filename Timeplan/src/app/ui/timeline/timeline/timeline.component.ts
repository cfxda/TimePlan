
import {Item} from '../../../items/shared/item';
import {ItemService} from '../../../items/shared/item.service';

import {Component, OnInit, Input} from '@angular/core';
import {FirebaseListObservable} from 'angularfire2/database';
import * as vis from 'vis'
import domtoimage from 'dom-to-image';
import * as PptxGenJS from 'pptxgenjs';

import * as html2canvas from 'html2canvas';


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
  public showCurrentTime: boolean = false;



  container;

  save() {
    var supera = this.timeline.itemsData();
  }

  ngOnInit() {
    this.itemList = this.itemSvc.getItemsList()

    const isTest = 'TRUE';
    // Create a DataSet (allows two way data-binding)

    var groups = new vis.DataSet();

    var options = {};

    var visItemsList = new vis.DataSet();


    var groupscount = 0;

    //^ if(isTest='')
    if (visItemsList.length == 0) {

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
            var defaultStyle = 'color:#000;background-color:#127bdc; border-color:#fff; dot-color:#fff;'
            if (typeof (itemd.style) == "undefined")
              itemd.style = defaultStyle

            if ((typeof (itemd.startDate) != "undefined") && (typeof (itemd.stopDate) != "undefined")) //, className: itemd.style
            {
              visItemsList.update({id: itemd.$key, content: itemd.topic, start: new Date(itemd.startDate), end: new Date(itemd.stopDate), group: groupsid, style: itemd.style})
            }
            else
              visItemsList.update({id: itemd.$key, content: itemd.topic, start: new Date(itemd.startDate), end: new Date(itemd.stopDate), group: groupsid, type: 'point', style: 'color:#000;background-color:#fff; border-color:#fff; dot-color:#fff;'})

          })
        }
      );
    }


    //necessary since this  is not working in the event
    var del = this.dItem.bind(this)
    var upd = this.itemList.update.bind(this)
    var self = this;
    // Configuration for the Timeline
    options = {
      width: '1300px',
      selectable: true,
      showCurrentTime: this.showCurrentTime,

      editable: {
        add: false,         // add new items by double tapping
        updateTime: false,  // drag items horizontally
        updateGroup: false, // drag items from one group to another
        remove: false,
        overrideItems: true  // allow these options to override item.editable
      },
      autoResize: true,
      onRemove: function(item, callback) {

        self.itemSvc.deleteItem(item.key)
        callback(item)
      },
      onAddGroup: function(item, callback) {

        self.itemSvc.updateItem(item.id, {group: item.group})
        callback(item)
      },


      //         onUpdate: function(item, callback) {
      //        
      //       if((typeof (item.start) != "undefined") && (typeof (item.stop) != "undefined"))
      //         {
      //                            self.itemSvc.updateItem(item.id,{startDate: item.start, stopDate: item.stop})
      //       }
      //         else if(typeof (item.start) != "undefined") {
      //                   self.itemSvc.updateItem(item.id,{startDate: item.start})
      //         }
      //         else if (typeof (item.stop) != "undefined")
      //                       
      //                       {self.itemSvc.updateItem(item.id,{stopDate:stop})
      //         }
      //       
      //        callback(item)
      //      },
      
      onMove: function(item, callback) {

        if ((typeof (item.start) != "undefined") && (typeof (item.stop) != "undefined")) {
          self.itemSvc.updateItem(item.id, {startDate: item.start, stopDate: item.stop})
        }
        else if (typeof (item.start) != "undefined") {
          self.itemSvc.updateItem(item.id, {startDate: item.start})
        }
        else if (typeof (item.stop) != "undefined") {
          self.itemSvc.updateItem(item.id, {stopDate: item.stop})
        }

        callback(item)
      },

      margin: {
        item: 20
      }
    }

    this.container = document.getElementById('visualization');
    // Create a Timeline
    this.timeline = new vis.Timeline(this.container, visItemsList, options);

    this.timeline.setGroups(groups);



    this.timeline.on('doubleClick', function(properties) {

      const bgColor = (<HTMLInputElement>document.getElementById('bgColor')).value;
      const fontColor = (<HTMLInputElement>document.getElementById('fontColor')).value;
      const brdColor = (<HTMLInputElement>document.getElementById('brdColor')).value;

      var colorC = "color:" + fontColor + ";background-color:" + bgColor + "; border-color:" + brdColor + "! important; dot-color:" + brdColor + ";" //for now boarder color => transparent

      //visItemsList.update({id: properties.item, style: col      
      var item = visItemsList.get(properties.item);
      self.itemSvc.updateItem(item.id, {style: colorC})

    });

    function move(percentage) {
      var range = self.timeline.getWindow();
      var interval = range.end - range.start;

      self.timeline.setWindow({
        start: range.start.valueOf() - interval * percentage,
        end: range.end.valueOf() - interval * percentage
      });
    }
    document.getElementById('zoomIn').onclick = function() {self.timeline.zoomIn(0.2);};
    document.getElementById('zoomOut').onclick = function() {self.timeline.zoomOut(0.2);};
    document.getElementById('moveLeft').onclick = function() {move(0.2);};
    document.getElementById('moveRight').onclick = function() {move(-0.2);};

  }
  dItem(key: string) {
    this.itemSvc.deleteItem(key);
    //TODO Update timelife after delete ITem
  }


  saveAsImage() {
    var chart = document.getElementById('visualization').children;

   
    var h = chart[0].clientHeight;
    var w = chart[0].clientWidth;

    var canvasEdit = document.createElement('canvas');
    canvasEdit.width = w * 2.1;
    canvasEdit.height = h * 2.1;
    canvasEdit.style.width = w + 'px';
    canvasEdit.style.height = h + 'px';
    var context = canvasEdit.getContext('2d');


    context.scale(2, 2);
    context.translate(-300, -120);

    html2canvas(chart, {canvas: canvasEdit}).then(function(canvas) {
      var dataUrl = canvasEdit.toDataURL("image/png").replace("image/png", "image/octet-stream");
      var HC = chart[0].clientHeight / 96;
      var WC = chart[0].clientWidth / 96;

      var link = document.createElement('a');
      link.download = 'timeline.png';
      link.href = dataUrl;
      link.click();
    }

    )
  }






  createPPT() {
    var chart = document.getElementById('visualization').children;


    var h = chart[0].clientHeight;
    var w = chart[0].clientWidth;

    var canvasEdit = document.createElement('canvas');
    canvasEdit.width = w * 2.1;
    canvasEdit.height = h * 2.1;
    canvasEdit.style.width = w + 'px';
    canvasEdit.style.height = h + 'px';
    var context = canvasEdit.getContext('2d');


    context.scale(2, 2);
    context.translate(-300, -120);

    html2canvas(chart, {canvas: canvasEdit}).then(function(canvas) {
      var dataUrl = canvasEdit.toDataURL("image/png").replace("image/png", "image/octet-stream");
      var pptx = PptxGenJS;

      var slide = pptx.addNewSlide();
      var HC = chart[0].clientHeight / 140;
      var WC = chart[0].clientWidth / 140;

      var link = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      slide.addImage({data: link, x: 0.1, y: 0.2, w: WC, h: HC});
      pptx.save('Your Timeline');






    }

    )
  }


}