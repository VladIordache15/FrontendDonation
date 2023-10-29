import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {EventComponent} from "../../event/event/event.component";
import {EventJobComponent} from "../event-job/event-job.component";



const routes: Routes = [
  {
    path: '',
    component: EventJobComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventJobRoutingModule { }
