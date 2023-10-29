import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EventRoutingModule} from "./event-routing.module";

import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {TableModule} from "primeng/table";



@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    EventRoutingModule,
    ButtonModule,
    DialogModule,
    TableModule
  ]
})
export class EventModule { }
