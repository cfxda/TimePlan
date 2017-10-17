import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


///// Start FireStarter
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = environment.firebaseConfig;

// Core
import { CoreModule } from './core/core.module';




// Feature Modules
import { ItemModule } from './items/shared/item.module';

import { UiModule } from './ui/shared/ui.module';
///// End FireStarter

// Angular Material IO


@NgModule({
  declarations: [
    AppComponent, 
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    CoreModule,
    ItemModule,
    UiModule,
    AngularFireModule.initializeApp(firebaseConfig),     
  ],
  bootstrap: [
    AppComponent
  ]   
})
export class AppModule { }

