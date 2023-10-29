import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {EventService} from "../../event/service/event.service";
import {EventJobService} from "../event-job.service";
import {Eventt} from "../../event/model/Event";
import {EventJob} from "../EventJob";
import {Status} from "../../event/model/Status";
import {Router} from "@angular/router";

@Component({
  selector: 'app-event-job',
  templateUrl: './event-job.component.html',
  styleUrls: ['./event-job.component.css']
})
export class EventJobComponent implements OnInit {
   selectedEventJob: any


  constructor(private eventJobService: EventJobService,private messageService: MessageService,
              private translate: TranslateService, private router:Router){}
  // @ts-ignore
  currentEvent: Eventt;
  // @ts-ignore
  eventJobsList: EventJob[];
  selectedEvent: any;

  // @ts-ignore
  eventJobDialog: boolean;
  // @ts-ignore
  eventJobDialog1: boolean;
  // @ts-ignore
  submitted: boolean;
  Delete: any;
  summary2: string = '';
  errorMessage:any

  eventJob:{id:number,jobDescription: string,jobStartTime : Date,
    jobEndTime: Date,
    volsRequired: number,
    volsRegistered : number,
    volsCheckedIn: number }  = {id:0,jobDescription: '',jobStartTime : new Date(),
    jobEndTime: new Date(),
    volsRequired: 0,
    volsRegistered : 0,
    volsCheckedIn: 0}


  ngOnInit(): void {
    this.currentEvent=history.state.event;
    if(this.currentEvent.id)
      this.eventJobService.getEventJobs(this.currentEvent.id.toString()).subscribe(ej=>this.eventJobsList=ej)
    console.log(this.currentEvent)
  }

  openNew() {
    this.eventJob = {id:0,jobDescription: '',jobStartTime : new Date(),
      jobEndTime: new Date(),
      volsRequired: 0,
      volsRegistered : 0,
      volsCheckedIn: 0}

    this.submitted = false;
    this.eventJobDialog = true;
  }
  hideDialog() {
    this.eventJobDialog = false;
    this.submitted = false;
  }
  hideDialog1() {
    this.eventJobDialog1 = false;
    this.submitted = false;
    window.location.reload()
  }
  removeExcessiveWhitespace(input: string): string {
    return input.replace(/\s+/g, ' ').trim();
  }
  showSuccessAdd(mesg: string){
    // for p-toast ---- translated message by successful insertion
    this.translate.stream([
      "Added_successfully"
    ]).subscribe(translations => {
      this.summary2 = "Added_";
    });
    this.messageService.add({ severity: 'success', detail: mesg})
  }
  showError(message:string) {
    this.messageService.add({
      severity: 'error', // Severity level for styling (success, info, warn, error)
      summary: 'Error',
      detail: message,
      life: 1500 // Duration in milliseconds
    });
  }

  fullTextMap: Record<string, boolean> = {};


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

  openEdit(eventJob: any) {
    this.selectedEventJob = eventJob;
    this.eventJob = eventJob
    this.submitted = false;
    this.eventJobDialog1 = true;
  }

  deleteSelectedEvents() {

  }

  deleteEventJob(eventJob: any) {

  }
  goToSignUps(eventJob:EventJob) {
    this.router.navigate(['/signUps'], { state: { eventJob } })

  }
}
