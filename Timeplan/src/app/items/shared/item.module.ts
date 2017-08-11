import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { SharedModule } from '../../shared/shared.module';
import { TimelineComponent } from '../../ui/timeline/timeline/timeline.component';

import { ItemService } from './item.service';
import { ItemsListComponent } from '../items-list/items-list.component';
import { ItemFormComponent } from '../item-form/item-form.component';
import { ItemDetailComponent } from '../item-detail/item-detail.component';
import { HttpModule } from '@angular/http';

// Angular Material IO
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdChipsModule,
  MdCoreModule,
  MdDatepickerModule,
  MdDialogModule,
  MdExpansionModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdNativeDateModule,
  MdPaginatorModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdSortModule,
  MdTableModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import * as Vis from 'vis';

import {ColorPickerModule} from 'angular4-color-picker';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireDatabaseModule,
    MdDatepickerModule ,  MdInputModule, MdNativeDateModule , BrowserAnimationsModule, MdButtonModule, MdSidenavModule,
    ReactiveFormsModule, FormsModule,  BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MdNativeDateModule,
    ReactiveFormsModule,
    ColorPickerModule
  ],
  declarations: [
    TimelineComponent,
    ItemsListComponent,
    ItemFormComponent,
    ItemDetailComponent,
  ],
  providers: [
    ItemService
  ]
})
export class ItemModule { }
