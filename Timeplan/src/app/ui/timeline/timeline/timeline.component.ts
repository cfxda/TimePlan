
import {Item} from '../../../items/shared/item';
import {ItemService} from '../../../items/shared/item.service';

import {Component, OnInit, Input} from '@angular/core';
import {FirebaseListObservable} from 'angularfire2/database';
import * as vis from 'vis'
import  PptxGenJS from 'pptxgenjs';

import * as html2canvas from 'html2canvas';


@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']

})


export class TimelineComponent implements OnInit {

  constructor(public itemSvc: ItemService) {}

  itemList: FirebaseListObservable<Item[]> = null;

  timeline;


  showSpinner: boolean = true;

  
  public showCurrentTime: boolean = false;
  
     styleSet = ['color:#f3f3f3;background-color:#273296; border-color:rgba(18,123,220,0); dot-color:#fff;',
                    'color:#f3f3f3;background-color:#37a18b; border-color:rgba(18,123,220,0); dot-color:#fff;'
                   ,'color:#f3f3f3;background-color:#7a858f; border-color:rgba(18,123,220,0); dot-color:#fff;'
                   , 'color:#f3f3f3;background-color:#5180ab; border-color:rgba(18,123,220,0); dot-color:#fff;'
                   , 'color:#000;background-color:#127bdc; border-color:rgba(18,123,220,0); dot-color:#fff;'
                   , 'color:#000;background-color:#227bdc; border-color:rgba(18,123,220,0); dot-color:#fff;'
                   , 'color:#000;background-color:#327bdc; border-color:rgba(18,123,220,0); dot-color:#fff;'
                   , 'color:#000;background-color:#427bdc; border-color:rgba(18,123,220,0); dot-color:#fff;'
                   , 'color:#000;background-color:#527bdc; border-color:rgba(18,123,220,0); dot-color:#fff;'
                   , 'color:#000;background-color:#627bdc; border-color:rgba(18,123,220,0); dot-color:#fff;'   ];
    
  
  

  container;

  save() {
    var supera = this.timeline.itemsData();
  }

  ngOnInit() {
    
   var  groups = new vis.DataSet();
    
    this.itemList = this.itemSvc.getItemsList()

    const isTest = 'TRUE';
    // Create a DataSet (allows two way data-binding)

 
    var options = {};

    var visItemsList = new vis.DataSet();
 var      groupCount = 0;
    

var style ="";
    //^ if(isTest='')
    if (visItemsList.length == 0) {

      this.itemList.subscribe(
        item => {
          item.map(itemd => {
            var groupId;

            var getGroup = groups.get({
              fields: ['id','style'],
              filter: function(item) {
                return (item.content == itemd.group);
              }
            })
            if (getGroup.length != 0)
              {
              groupId = getGroup[0].id;
              style = this.styleSet[groupId];
            }
            else {
              style = this.styleSet[groupCount]
              
              //add styles to group to enable styling
              groups.add({id: groupCount, content: itemd.group });
              groupId = groupCount;
              
              groupCount++;

            }
            
            //modified style? if yes keep it => else group style
          if(!itemd.style)
            {
             itemd.style = style
            }
            

            if (itemd.startDate && itemd.stopDate) //, className: itemd.style
            {
              visItemsList.update({id: itemd.$key, content: itemd.topic, start: new Date(itemd.startDate), end: new Date(itemd.stopDate), group: groupId, style: itemd.style})
            }
            else
              {
            
              visItemsList.update({id: itemd.$key, content: itemd.topic, start: new Date(itemd.startDate), group: groupId, type: 'point', style: 'color:#000;'})
            }
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

      var colorC = "color:" + fontColor + ";background-color:" + bgColor + "; border-color:" + brdColor + "; dot-color:" + brdColor + ";" //for now boarder color => transparent

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
    document.getElementById('moveLeft').onclick = function() {move(-0.2);};
    document.getElementById('moveRight').onclick = function() {move(0.2);};

  }
  dItem(key: string) {
    this.itemSvc.deleteItem(key);
    //TODO Update timelife after delete ITem
  }

  
  saveAsImage() {
    window.scrollTo(0, 0);

var chart = document.getElementById('visualization').children[0];

  var testcanvas = document.createElement('canvas');
   var w = chart.clientWidth;
      var h = chart.clientHeight;
  testcanvas.width = w * 2+15;
  testcanvas.height = h * 2+15;
  testcanvas.style.width = w + 'px';
  testcanvas.style.height = h + 'px';
  var context = testcanvas.getContext('2d');
  context.scale(2, 2);
   var offsetH= document.getElementById('visualization').offsetTop;
     var offsetW= document.getElementById('visualization').offsetLeft;
    
    context.translate(-offsetW,-offsetH);

  html2canvas(chart, {
    canvas: testcanvas,
    onrendered: function(canvas) {
    },
    width:  chart.clientWidth,
    height: chart.clientHeight
      }).then(function(canvas) {
      var dataUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

     var link = document.createElement('a');
     link.download = 'timeline.png';
    link.href = dataUrl;
      document.body.appendChild(link);
    link.click();
      document.body.removeChild(link);
  }    )
  }

  createPPT() {
    window.scrollTo(0,0);
    var htmlDiv= document.getElementById('visualization')
    var chart = htmlDiv.children[0];
    var h = chart.clientHeight;
    var w = chart.clientWidth;

    var canvasEdit = document.createElement('canvas');
    canvasEdit.width = w * 2+15;;
    canvasEdit.height = h * 2+15;;
    canvasEdit.style.width = w + 'px';
    canvasEdit.style.height = h + 'px';
   
    var context = canvasEdit.getContext('2d');
    context.scale(2, 2);
    var offsetH= htmlDiv.offsetTop;
     var offsetW= htmlDiv.offsetLeft;
    
    context.translate(-offsetW,-offsetH);
    html2canvas(chart, {canvas: canvasEdit}).then(function(canvas) {
      var link = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      
      var pptx =  PptxGenJS;
      

      var slide = pptx.addNewSlide();
      var HC = chart.clientHeight / 140;
      var WC = chart.clientWidth / 140;
      
      slide.addImage({data: link, x: 0.1, y: 0.1, w: WC, h: HC});
      pptx.save('Your Timeline');




    }

    )
  }



}