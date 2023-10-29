import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EventRoutingModule} from "../event/event-routing.module";
import {EventJobRoutingModule} from "./event-job-routing/event-job-routing.module";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EventJobRoutingModule
  ]
})
export class EventJobModule { }
