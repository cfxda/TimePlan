import { AppDateAdapter, APP_DATE_FORMATS } from '../../core/AppDateApdater';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { SharedModule } from '../../shared/shared.module';
import { UiModule } from '../../ui/shared/ui.module';
import { TimelineComponent } from '../../ui/timeline/timeline/timeline.component';

import { ItemService } from './item.service';
import { ItemsListComponent } from '../items-list/items-list.component';
import { ItemFormComponent } from '../item-form/item-form.component';
import { ItemDetailComponent } from '../item-detail/item-detail.component';
import { HttpModule } from '@angular/http';

// Fileupload
import { FileDropDirective, FileSelectDirective } from 'ng2-file-upload';


// Angular Material IO
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {

} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import * as Vis from 'vis';

import { RouterModule } from '@angular/router'
import {ColorPickerModule} from 'angular4-color-picker';

import { MD_DATE_FORMATS, DateAdapter, MdFormFieldModule, MdInputModule, MdButtonModule, MdRadioModule, MdSelectModule, MdTabsModule, MdSliderModule, MdSlideToggleModule, MdAutocompleteModule, MdDatepicker, MdDatepickerModule} from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    
    FormsModule,
        ReactiveFormsModule,
    
    AngularFireDatabaseModule,
  CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule, 
    BrowserAnimationsModule, ColorPickerModule, MdButtonModule, MdRadioModule, MdTabsModule, 
    MdSelectModule, MdSliderModule, MdAutocompleteModule, MdDatepickerModule, MdInputModule,
    MdSlideToggleModule,
    FormsModule,
    HttpModule,
     
    ColorPickerModule, RouterModule
  ],
  declarations: [
    TimelineComponent,
    ItemsListComponent,
    ItemFormComponent,
    ItemDetailComponent,
    
    
  ],
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MD_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }, ItemService
    ],
  
  
})
export class ItemModule { }
