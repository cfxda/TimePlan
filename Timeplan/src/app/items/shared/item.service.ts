import { Injectable } from '@angular/core';
// import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, AngularFireDatabase } from "angularfire2";
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Item } from './item';
import { FormControl } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';


 const defaultStyle ='color:#fff5f5;background-color:#273296; border-color:#fff; dot-color:#fff;'

@Injectable()
export class ItemService {

  private basePath: string = '/items';

  items: FirebaseListObservable<Item[]> = null; //  list of objects
  item: FirebaseObjectObservable<Item> = null; //   single object
  userId: string;
  public bgColor: string = "#127bdc";
  public fontColor: string = "#000";
  public brdColor: string = "#RRGGBBAA";
  
  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if (user) this.userId = user.uid
    })
  }
  // Return an observable list with optional query
  // You will usually call this from OnInit in a component
  getItemsList(query= {}): FirebaseListObservable<Item[]> {
        if (!this.userId) return;
      this.items = this.db.list(`items/${this.userId}`, {
      query: query
    });
    return this.items
    
  }

  // Return a single observable item
  getItem(key: string): FirebaseObjectObservable<Item> {
    const itemPath =  `${this.basePath}/${key}`;
    this.item = this.db.object(itemPath)
    return this.item
  }

  // Create a bramd new item
  createItem(item: Item): void  {
        item.userId = this.userId
    var start="";
    var stop="";
    var groupName="";
      if(item.startDate!=undefined)
 start=     item.startDate.toISOString() 
                   
    
if(item.stopDate!=undefined)
 stop=     item.stopDate.toISOString() 
  
    
   if(item.group!=undefined)
     groupName= item.group;
                         //date is not support in firebase => convert to string , style not applied => non
        this.items.push({ topic: item.topic, group: groupName,startDate: start,  stopDate: stop, timestamp : item.timeStamp, userId: item.userId})
      .catch(error => this.handleError(error))
  }


  // Update an exisiting item
  updateItem(key: string, value: any): void {
    this.items.update(key, value)
      .catch(error => this.handleError(error))
  }

  // Deletes a single item
  deleteItem(key: string): void {
      this.items.remove(key)
        .catch(error => this.handleError(error))
  }

  // Deletes the entire list of items
  deleteAll(): void {
      this.items.remove()
        .catch(error => this.handleError(error))
  }


  // Default error handling for all actions
  private handleError(error) {
    console.log(error)
  }


}
