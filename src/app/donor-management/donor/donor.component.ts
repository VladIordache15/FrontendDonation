import {Component, OnInit} from '@angular/core';
import {DonorService} from "../donor.service";
import {Donor} from "../Donor";
import {ConfirmationService, MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.css']
})
export class DonorComponent implements OnInit {
// @ts-ignore
  donorDialog: boolean;
  // @ts-ignore
  donorDialog1: boolean;

  selectedDonor: any;

  // @ts-ignore
  donorListFromCampaign: Donor[]

    // @ts-ignore
  donorList : Donor[];

  // @ts-ignore
  selectedDonors: Donor[];

  // campaign: Campaign;

  // campaign:{id:number,name:string, purpose:string} ={id:0,name: '', purpose:''}
  donor:{id:number,firstName:string,lastName:string,additionalName:string,maidenName:string}={id:0,firstName:'',lastName:'',additionalName:'',maidenName:''}
  errorMessage:any

  // @ts-ignore
  submitted: boolean;
  Delete: any;
  summary2: string = '';


  constructor(private donorService: DonorService,private confirmationService:ConfirmationService,private messageService: MessageService, private translate: TranslateService) { }

  ngOnInit() {
    console.log("start donor manager")




      this.donorService.loadDonors().subscribe()
      this.donorService.getDonors().subscribe(don=> this.donorList=don)
      console.log(this.donorList)

  }

  openNew() {
    this.donor ={id:0,firstName:'',lastName:'',additionalName:'',maidenName:''}

    this.submitted = false;
    this.donorDialog = true;
  }
  hideDialog() {
    this.donorDialog = false;
    this.submitted = false;
  }
  hideDialog1() {
    this.donorDialog1 = false;
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


  saveDonor() {
    this.submitted = true;
    if(this.donor.firstName && this.donor.lastName &&
      this.donor.firstName.replace(/\s/g, '').length>0 && this.donor.lastName.replace(/\s/g, '').length>0 ) {
      const newDonor = {firstName: this.removeExcessiveWhitespace(this.donor.firstName), lastName: this.removeExcessiveWhitespace(this.donor.lastName),
        additionalName: this.removeExcessiveWhitespace(this.donor.additionalName), maidenName: this.removeExcessiveWhitespace(this.donor.maidenName)}

      this.donorService.saveDonorToDB(newDonor).subscribe(
        (response)=>{
          console.log(response)
          this.donorList.push(response)
          this.donorDialog = false
          this.donor = {id: 0, firstName: '', lastName: '', additionalName: '', maidenName: ''}
          this.showSuccessAdd("Added successfully");

        },
        (error)=>{
          console.log(error.error.text)
          this.showError(error.error.text)
        }
      )




    }else{
      console.warn('Donor first name or last name cannot be empty.');
      this.errorMessage = "Campaign name or purpose cannot be empty.";
    }
  }
  private showError(message:string) {
    this.messageService.add({
      severity: 'error', // Severity level for styling (success, info, warn, error)
      summary: 'Error',
      detail: message,
      life: 1500 // Duration in milliseconds
    });
  }


  editDonor() {
    this.submitted = true;
    if(this.donor.firstName && this.donor.lastName &&
      this.donor.firstName.replace(/\s/g, '').length>0 && this.donor.lastName.replace(/\s/g, '').length>0 ) {
      const newDonor = {
        firstName: this.removeExcessiveWhitespace(this.donor.firstName),
        lastName: this.removeExcessiveWhitespace(this.donor.lastName),
        additionalName: this.removeExcessiveWhitespace(this.donor.additionalName),
        maidenName: this.removeExcessiveWhitespace(this.donor.maidenName)
      }
      const donor = this.selectedDonor
      console.log(donor.id)
       this.donorService.updateDonorFromDB(donor.id.toString(), this.donor).subscribe(
        response=>{
          console.log(response)
          this.donorDialog1 = false

        },
         (error)=>{
           console.log(error.error.text)
           this.showError(error.error.text)
         }
      )

    }else {
      console.warn('Donor first name or last name cannot be empty.');
      this.errorMessage = "Campaign name or purpose cannot be empty.";
    }


  }


   deleteDonor(donor: any) {

    if (confirm("Are you sure you want to delete this donor?")) {
      const idd = donor.id;

      console.log(donor.id)
      this.donorService.deleteFromDB(donor.id.toString()).subscribe(
        response => {
          console.log('Deleted successfully:', response);
          this.donorList = this.donorList.filter(camp => camp.id !== idd);
          this.showSuccessAdd('Deleted successfully:')
        },
        error => {
          console.error('Error deleting campaign:', error.error);
          this.showError(error.error.text)
        }
      );

    }


  }



   deleteSelectedDonors() {
    if (confirm("Are you sure you want to delete this donor?")) {
      this.selectedDonors.forEach(donor => {
        const idd = donor.id;
        console.log(idd);
        // @ts-ignore
        this.donorService.deleteFromDB(donor.id.toString()).subscribe(
          response => {
            console.log('Deleted successfully:', response);
            this.donorList = this.donorList.filter(camp => camp.id !== idd);
            this.showSuccessAdd('Deleted successfully:')
          },
          error => {
            console.error('Error deleting campaign:', error.error);
            this.showError(error.error.text)
          }
        );
      });


    }
  }
  openEdit(donor: any) {
    this.selectedDonor = donor;
    this.donor = donor
    this.submitted = false;
    this.donorDialog1 = true;

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






}
