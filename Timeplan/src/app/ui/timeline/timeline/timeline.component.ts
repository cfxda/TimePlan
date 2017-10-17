
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


  itemList: FirebaseListObservable<Item[]> = null;

  timeline;
  container;

  showSpinner = true;
  public showCurrentTime = false;

  constructor(public itemSvc: ItemService) {}





onChange($event)
  {
//       if (!this.itemSvc.filter) {
//      this.timeline.setGroups(this.itemSvc.groups);
//    }else {
      let filter = this.itemSvc.selectedGroup;
   if(filter.length)
     {
      this.timeline.setGroups(this.itemSvc.groups.get({
        filter: function(item) {
          return (filter.includes(item.content));
        }
     }))
  }
  else
     {
   this.timeline.setGroups(this.itemSvc.groups);
   }
//   }
   this.timeline.redraw()
 }



  save() {
    const supera = this.timeline.itemsData();
  }

  ngOnInit() {
this.itemSvc.groupList = []
    this.itemSvc.groups = new vis.DataSet();
    // let groups = new vis.DataSet();

    this.itemList = this.itemSvc.getItemsList()

    // Create a DataSet (allows two way data-binding)


    let options = {};

    let visItemsList = new vis.DataSet();
    let groupCount = 0;


    let style = '';
    if (visItemsList.length == 0) {

      this.itemList.subscribe(
        item => {
          item.map(itemd => {

            //FilTER TODO



            let groupId;

            let getGroup = this.itemSvc.groups.get({
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
              this.itemSvc.groups.add({id: groupCount, content: itemd.group, value: groupCount});
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
          }
          )

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
      groupOrder: function(a, b) {
        return a.value - b.value;
      },
      groupOrderSwap: function(a, b, groups) {
        var v = a.value;
        a.value = b.value;
        b.value = v;
      },
      orientation: 'both',
      editable: false,
      groupEditable: true,
      autoResize: true,
      margin: {axis: 5, item: {vertical: 5, horizontal: 0}}//      onRemove: function(item, callback) {
      //
      //        self.itemSvc.deleteItem(item.key)
      //        callback(item)
      //      },
      //      onAddGroup: function(item, callback) {
      //
      //        self.itemSvc.updateItem(item.id, {group: item.group})
      //        callback(item)
      //      },


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

      //      onMove: function(item, callback) {
      //
      //        if ((typeof (item.start) != "undefined") && (typeof (item.stop) != "undefined")) {
      //          self.itemSvc.updateItem(item.id, {startDate: item.start, stopDate: item.stop})
      //        }
      //        else if (typeof (item.start) != "undefined") {
      //          self.itemSvc.updateItem(item.id, {startDate: item.start})
      //        }
      //        else if (typeof (item.stop) != "undefined") {
      //     self.itemSvc.updateItem(item.id, {stopDate: item.stop})
      //        }
      //
      //        callback(item)
      //      },

     
    }

    this.container = document.getElementById('visualization');



    // Create a Timeline
    this.timeline = new vis.Timeline(this.container, visItemsList, options);

    
    //filter groups in timeline
     let filter = this.itemSvc.selectedGroup
    if(filter.length)
      {    
       this.timeline.setGroups(this.itemSvc.groups.get({
        filter: function(item) {
          return (filter.includes(item.content));
        }
      }))
    }
     else
      {
        this.timeline.setGroups(this.itemSvc.groups)
    }
    


    


    this.timeline.on('click', function(properties) {
      let colorC;
      if (self.itemSvc.editColor) {
        if (self.itemSvc.colorSelect === 'custom') {
          const bgColor = (<HTMLInputElement>document.getElementById('bgColor')).value;
          const fontColor = (<HTMLInputElement>document.getElementById('fontColor')).value;
          const brdColor = (<HTMLInputElement>document.getElementById('brdColor')).value;
          // for now boarder color => transparent
          colorC = 'color:' + fontColor + ';background-color:' + bgColor + '; border-color:' + brdColor + '; dot-color:' + brdColor + ';'
        }else {
          colorC = self.itemSvc.styleSet.find(x => x[0] === self.itemSvc.colorSelect[0])[1];
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
    document.getElementById('zoomIn').onclick = function() {self.timeline.zoomIn(0.8)}
    document.getElementById('zoomOut').onclick = function() {self.timeline.zoomOut(0.8)}
    document.getElementById('moveLeft').onclick = function() {move(0.4)}
    document.getElementById('moveRight').onclick = function() {move(-0.4)}
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
  changeColor(col)
  {
  this.itemSvc.colorSelect === col;

  }
}
