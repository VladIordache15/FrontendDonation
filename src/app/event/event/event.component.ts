import {Component, OnInit} from '@angular/core';
import {EventService} from "../service/event.service";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {Eventt} from "../model/Event";
import moment from "moment";
import {Status} from "../model/Status";
import {EventJob} from "../../eventJob/EventJob";
import {Router} from "@angular/router";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  // @ts-ignore
  eventDialog: boolean;
  // @ts-ignore
  eventDialog1: boolean;
  // @ts-ignore
  eventList : Eventt[];


  // @ts-ignore
  submitted: boolean;
  Delete: any;
  summary2: string = '';
  errorMessage:any

  selectedEvent:any;



  event:{id:number,eventName:string,eventStartDate:  Date,eventEndDate:Date, description:string, eventStatus:Status, notes:string,
    openJobs:number,volsRequired:number,volsRegistered:number}={id:0,eventName:'',eventStartDate:new Date(),eventEndDate:new Date(), description:'', eventStatus:Status["Past"], notes:'',
    openJobs:0,volsRequired:0,volsRegistered:0}


  constructor(private eventService: EventService,private messageService: MessageService,
              private translate: TranslateService,  private router: Router){}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(event=>this.eventList=event)
    console.log(this.eventList)
  }
  openNew() {
    this.event ={id:0,eventName:'',eventStartDate:new Date(),eventEndDate:new Date(), description:'', eventStatus:Status["Past"], notes:'',
      openJobs:0,volsRequired:0,volsRegistered:0}

    this.submitted = false;
    this.eventDialog = true;
  }
  hideDialog() {
    this.eventDialog = false;
    this.submitted = false;
  }
  hideDialog1() {
    this.eventDialog1 = false;
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

  getStatus(start: Date, end: Date){
    const currentDate= new Date();
    if(currentDate>end){
      return "Past"
    }else if(currentDate<start){
      return "Upcoming"
    }else{
      return "Ongoing"
    }

  }


  saveEvent(){
    this.submitted = true;
    if(this.event.eventEndDate && this.event.eventName  && this.event.description&&
      this.event.description && this.event.notes ){
      const newEvent = {
        eventName: this.removeExcessiveWhitespace(this.event.eventName),
        description: this.removeExcessiveWhitespace(this.event.description),
        notes: this.removeExcessiveWhitespace(this.event.notes),
        // eventStartDate: moment.utc(this.event.eventStartDate).local().format('YYYY-MM-DDTHH:mm:SS.sss+00:00'),
        eventStartDate: new Date(this.event.eventStartDate),
        eventEndDate : new Date(this.event.eventEndDate),
        // eventEndDate: moment.utc(this.event.eventEndDate).local().format('YYYY-MM-DDTHH:mm:SS.sss+00:00'),
        openJobs: this.event.openJobs,
        volsRegistered: this.event.volsRegistered,
        volsRequired: this.event.volsRequired,
        eventStatus: Status[this.getStatus(new Date(this.event.eventStartDate),new Date(this.event.eventEndDate))],


      }
      console.log(newEvent)

      this.eventService.saveEventToDB(newEvent).subscribe(
        response=>{
          this.eventList.push(response);
          this.eventDialog = false;
          this.event ={id:0,eventName:'',eventStartDate:new Date(),eventEndDate:new Date(), description:'', eventStatus:Status["Past"], notes:'',
            openJobs:0,volsRequired:0,volsRegistered:0};
          this.showSuccessAdd("Added successfully");


        },(error)=>{
          console.log(error.error.text)
          this.showError(error.error.text)
        }
      )

    }else{
      console.warn('Donor first name or last name cannot be empty.');
      this.errorMessage = "Fields cannot be empty.";
    }

  }
  openEdit(event: any) {
    this.selectedEvent = event;
    this.event = event
    this.submitted = false;
    this.eventDialog1 = true;

  }

  editEvent(){
    this.submitted = true;
    if(this.event.eventEndDate && this.event.eventName && this.event.eventStatus && this.event.description&&
      this.event.description && this.event.notes ){
      const newEvent = {
        eventName: this.removeExcessiveWhitespace(this.event.eventName),
        description: this.removeExcessiveWhitespace(this.event.description),
        eventStatus: this.removeExcessiveWhitespace(this.event.eventStatus),
        notes: this.removeExcessiveWhitespace(this.event.notes),
        eventStartDate: this.event.eventStartDate,
        eventEndDate: this.event.eventEndDate,
        openJobs: this.event.openJobs,
        volsRegistered: this.event.volsRegistered,
        volsRequired: this.event.volsRequired

      }
      const event = this.selectedEvent;
      this.eventService.updateEventFromDB(event.id.toString(),this.event).subscribe(
        response=>{
          this.eventDialog1 = false
        },
        (error)=>{
          this.showError(error.error.text)
        }
      )
    }else{
      this.errorMessage = "Fields cannot be empty.";
    }
  }


  deleteEvent(event:any){
    if (confirm("Are you sure you want to delete this donor?")) {
      const idd = event.id;

      this.eventService.deleteEventFromDB(event.id.toString()).subscribe(
        response=>{
          console.log('Deleted successfully:', response);
          this.eventList = this.eventList.filter(event => event.id !== idd);
          this.showSuccessAdd('Deleted successfully:')

        },
        error => {
          console.error('Error deleting campaign:', error.error);
          this.showError(error.error.text)
        }
      )
    }
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



  deleteSelectedEvents() {

  }

//   getEventJobs(id:number):EventJob[]{
//     this.eventService.getEventJobs(id.toString()).subscribe(ej=>this.eventJobsList=ej)
//     return this.eventJobsList
//
// }
  goToJobs(event:Eventt) {
    this.router.navigate(['/eventJob'], { state: { event } })

  }
}
