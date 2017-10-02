
import {Item} from '../../../items/shared/item';
import {ItemService} from '../../../items/shared/item.service';

import {Component, OnInit, Input} from '@angular/core';
import {FirebaseListObservable} from 'angularfire2/database';
import * as vis from 'vis'
import PptxGenJS from 'pptxgenjs';

import * as html2canvas from 'html2canvas';
import * as fileSaver from 'file-saver';


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






  container;

  save() {
    let supera = this.timeline.itemsData();
  }

  ngOnInit() {

    let groups = new vis.DataSet();

    this.itemList = this.itemSvc.getItemsList()

    const isTest = 'TRUE';
    // Create a DataSet (allows two way data-binding)


    let options = {};

    let visItemsList = new vis.DataSet();
    let groupCount = 0;


    let style = "";
    //^ if(isTest='')
    if (visItemsList.length == 0) {

      this.itemList.subscribe(
        item => {
          item.map(itemd => {
            let groupId;

            let getGroup = groups.get({
              fields: ['id', 'style'],
              filter: function(item) {
                return (item.content == itemd.group);
              }
            })
            if (getGroup.length != 0) {
              groupId = getGroup[0].id;
              style = this.itemSvc.styleSet[groupId][1];
            }
            else {
              style = this.itemSvc.styleSet[groupCount][1];

              //add styles to group to enable styling
              groups.add({id: groupCount, content: itemd.group});
              groupId = groupCount;

              groupCount++;

            }

            //modified style? if yes keep it => else group style
            if (!itemd.style) {
              itemd.style = style
            }


            if (itemd.startDate && itemd.stopDate) //, className: itemd.style
            {
              visItemsList.update({id: itemd.$key, content: itemd.topic, start: new Date(itemd.startDate), end: new Date(itemd.stopDate), group: groupId, style: itemd.style})
            }
            else {

              visItemsList.update({id: itemd.$key, content: itemd.topic, start: new Date(itemd.startDate), group: groupId, type: 'point', style: 'color:#000;'})
            }
          })
        }
      );
    }


    //necessary since this  is not working in the event
    let del = this.dItem.bind(this)
    let upd = this.itemList.update.bind(this)
    let self = this;
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


    this.timeline.on('click', function(properties) {
let colorC;
      if (self.itemSvc.editColor) {
        if (self.itemSvc.colorSelect == 'custom') {
          const bgColor = (<HTMLInputElement>document.getElementById('bgColor')).value;
          const fontColor = (<HTMLInputElement>document.getElementById('fontColor')).value;
          const brdColor = (<HTMLInputElement>document.getElementById('brdColor')).value;

           colorC = "color:" + fontColor + ";background-color:" + bgColor + "; border-color:" + brdColor + '; dot-color:' + brdColor + ";" //for now boarder color => transparent
        }
        else {
          colorC = self.itemSvc.styleSet.find(x => x[0] == self.itemSvc.colorSelect[0])[1];
        }
        //visItemsList.update({id: properties.item, style: col      
        const item = visItemsList.get(properties.item);
        self.itemSvc.updateItem(item.id, {style: colorC})
      }
    });

    function move(percentage) {
      const range = self.timeline.getWindow();
      const interval = range.end - range.start;

      self.timeline.setWindow({
        start: range.start.valueOf() - interval * percentage,
        end: range.end.valueOf() - interval * percentage
      });
    }
    document.getElementById('zoomIn').onclick = function() {self.timeline.zoomIn(0.2); };
    document.getElementById('zoomOut').onclick = function() {self.timeline.zoomOut(0.2); };
    document.getElementById('moveLeft').onclick = function() {move(-0.2); };
    document.getElementById('moveRight').onclick = function() {move(0.2); };

  }
  dItem(key: string) {
    this.itemSvc.deleteItem(key);
    //TODO Update timelife after delete ITem
  }


  saveAsImage() {
    window.scrollTo(0, 0);

    const chart = document.getElementById('visualization').children[0];

    const testcanvas = document.createElement('canvas');
    const w = chart.clientWidth;
    const h = chart.clientHeight;
    testcanvas.width = w * 2 + 15;
    testcanvas.height = h * 2 + 15;
    testcanvas.style.width = w + 'px';
    testcanvas.style.height = h + 'px';
    const context = testcanvas.getContext('2d');
    context.scale(2, 2);
    const offsetH = document.getElementById('visualization').offsetTop;
    const offsetW = document.getElementById('visualization').offsetLeft;

    context.translate(-offsetW, -offsetH);

    html2canvas(chart, {
      canvas: testcanvas,
      onrendered: function(canvas) {
      },
      width: chart.clientWidth,
      height: chart.clientHeight
    }).then(function(canvas) {
      let dataUrl = canvas.toBlob(function(blob) {
        fileSaver.saveAs(blob, 'image.png');
      });



    })
  }

  createPPT() {
    window.scrollTo(0, 0);
    const htmlDiv = document.getElementById('visualization')
    const chart = htmlDiv.children[0];
    const h = chart.clientHeight;
    const w = chart.clientWidth;

    const canvasEdit = document.createElement('canvas');
    canvasEdit.width = w * 2 + 15;
    canvasEdit.height = h * 2 + 15;
    canvasEdit.style.width = w + 'px';
    canvasEdit.style.height = h + 'px';

    const context = canvasEdit.getContext('2d');
    context.scale(2, 2);
    const offsetH = htmlDiv.offsetTop;
    const offsetW = htmlDiv.offsetLeft;

    context.translate(-offsetW, -offsetH);
    html2canvas(chart, {canvas: canvasEdit}).then(function(canvas) {
      const link = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const pptx = PptxGenJS;


      const slide = pptx.addNewSlide();
      const HC = chart.clientHeight / 140;
      const WC = chart.clientWidth / 140;

      slide.addImage({data: link, x: 0.1, y: 0.1, w: WC, h: HC});
      pptx.save('Your Timeline');
    })
  }
}
