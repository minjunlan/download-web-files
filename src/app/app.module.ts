import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JsonpModule,HttpModule } from '@angular/http';

import {AppComponent}  from './app.componet'

@NgModule({
  imports:[ 
    BrowserModule ,
    HttpModule ,
    JsonpModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
