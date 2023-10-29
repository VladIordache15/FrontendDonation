import {Component, OnInit} from '@angular/core';
import {Volunteer} from "../Volunteer";
import {VolunteerService} from "../volunteer.service";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.css']
})
export class VolunteerComponent implements OnInit {
  Delete: any;
  // @ts-ignore
  submitted: boolean;
  // @ts-ignore
  volunteerDialog: boolean;
  // @ts-ignore
  volunteerDialog1: boolean;
  // @ts-ignore
   volunteerList: Volunteer[];
  // @ts-ignore
   selectedVolunteers: Volunteer[];
  summary2: string = '';

  selectedVolunteer:any


  volunteer:{id:number,firstName:string,lastName:string,mobileNumber:string,
     username:string,email:string,adress:string,JobsCount:number}={id:0,firstName:'',lastName:'',mobileNumber:'', username:'', email:'', adress:'', JobsCount:0}
  fullTextMap: Record<string, boolean> = {};
   errorMessage: any;

  constructor(private volunteerService: VolunteerService,private messageService: MessageService, private translate:TranslateService ){}


  openNew() {
    this.submitted = false;
    this.volunteerDialog = true;
    this.volunteer={id:0,firstName:'',lastName:'',mobileNumber:'', username:'', email:'', adress:'', JobsCount:0}
  }
  hideDialog() {
    this.volunteerDialog = false;
    this.submitted = false;
  }
  hideDialog1() {
    this.volunteerDialog1 = false;
    this.submitted = false;
    window.location.reload()
  }

  ngOnInit(): void {

     this.volunteerService.getVolunteers().subscribe(vol=>this.volunteerList=vol)
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


  saveVolunteer() { //trebuie tratat cazul in care se introduce doar space
    this.submitted=true;
    if(this.volunteer.firstName && this.volunteer.lastName && this.volunteer.mobileNumber
      && this.volunteer.adress && this.volunteer.email){
      const newVolunteer = {
        firstName: this.removeExcessiveWhitespace((this.volunteer.firstName)),
        lastName: this.removeExcessiveWhitespace((this.volunteer.lastName)),
        mobileNumber: this.removeExcessiveWhitespace((this.volunteer.mobileNumber)),
        adress: this.removeExcessiveWhitespace((this.volunteer.adress)),
        email: this.removeExcessiveWhitespace((this.volunteer.email)),
      }
      this.volunteerService.addVolunteer(newVolunteer).subscribe(
        (response)=>{
          this.volunteerList.push(response);
          this.volunteerDialog = false;
          this.volunteer={id:0,firstName:'',lastName:'',mobileNumber:'', username:'', email:'', adress:'', JobsCount:0};
          this.showSuccessAdd("Added successfully");

        },
        (error)=> {
          console.log(error.error.text)
          this.showError(error.error.text)
        })
    }else{
      console.warn('Fields cannot be empty');
      this.errorMessage = "Fields cannot be empty";
    }

  }
  editVolunteer() {
    this.submitted = true;
    if(this.volunteer.firstName && this.volunteer.lastName && this.volunteer.mobileNumber
      && this.volunteer.adress && this.volunteer.email){
      const vol = this.selectedVolunteer
      this.volunteerService.updateVolunteers(vol.id.toString(), this.volunteer).subscribe(
        response=>{
          this.volunteerDialog1 = false;
        },
        (error)=>{
          this.showError(error.error.text)
        }
      )

    }else{
      this.errorMessage = 'Fields cannot be empty';
    }

  }


  deleteDonor(volunteer: any) {
    if (confirm("Are you sure you want to delete this volunteer?")) {
      const idd= volunteer.id;
    }

  }

  openEdit(volunteer: any) {
    this.selectedVolunteer=volunteer;
    this.volunteer = volunteer;
    this.submitted=false;
    this.volunteerDialog1 = true;
  }


  deleteSelectedVolunteers() {

  }
}
