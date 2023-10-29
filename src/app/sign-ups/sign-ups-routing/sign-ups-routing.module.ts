import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {EventJobComponent} from "../../eventJob/event-job/event-job.component";
import {SignUpsComponent} from "../sign-ups/sign-ups.component";


const routes: Routes = [
  {
    path: '',
    component: SignUpsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpsRoutingModule { }
