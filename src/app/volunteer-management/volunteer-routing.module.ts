import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {CampaignComponent} from "../campaign-management/campaign/campaign.component";
import {VolunteerComponent} from "./volunteer/volunteer.component";



const routes: Routes = [
  {
    path: '',
    component: VolunteerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VolunteerRoutingModule { }
