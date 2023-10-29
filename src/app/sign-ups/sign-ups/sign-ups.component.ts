import {Component, OnInit} from '@angular/core';
import {Eventt} from "../../event/model/Event";
import {EventJob} from "../../eventJob/EventJob";
import {SignUpsService} from "../sign-ups.service";
import {SignUp} from "../SignUp";
import {Volunteer} from "../../volunteer-management/Volunteer";

@Component({
  selector: 'app-sign-ups',
  templateUrl: './sign-ups.component.html',
  styleUrls: ['./sign-ups.component.css']
})
export class SignUpsComponent implements OnInit{

  // @ts-ignore
  currentEventJob: EventJob;
// @ts-ignore
  submitted: boolean;
  // @ts-ignore
  signUpsList : SignUp[]
  fullTextMap: Record<string, boolean> = {};
  Delete: any;

  signUp:{ checkedInDate:Date,
    subDate:Date,
    startDateJob:Date,
    ednDateJob:Date,
    checkedIn: boolean}={
    checkedInDate:new Date(),
    subDate:new Date(),
    startDateJob:new Date(),
    ednDateJob:new Date(),
    checkedIn: false

  }
  // @ts-ignore
  signUpDialog: boolean;
  selectedSignUp: any;

  constructor(private signUpsService : SignUpsService){}


  ngOnInit(): void {

    this.currentEventJob=history.state.eventJob
    if(this.currentEventJob.id)
      this.signUpsService.getSignUps(this.currentEventJob.id.toString()).subscribe(su=>this.signUpsList=su)
  }

  openNew() {
    this.signUp={
      checkedInDate:new Date(),
      subDate:new Date(),
      startDateJob:new Date(),
      ednDateJob:new Date(),
      checkedIn: false

    }

    this.submitted = false;
    this.signUpDialog = true;
  }



  toggleFullText(donor: any, field: string): void {
    this.fullTextMap[field] = !this.fullTextMap[field];
  }

  getDisplayText(text: string): string {
    const maxLength = 12; // Adjust as needed
    if(text){
      if (text.length > maxLength && !this.fullTextMap[text]) {
        return text.substring(0, maxLength - 3) + '...';
      }
    }
    return text || "";
  }

  deleteSelectedEvents() {

  }


}
