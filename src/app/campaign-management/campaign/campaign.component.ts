import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Campaign} from "../campaign";
import {CampaignService} from "../campaign.service";
import {AbstractControl, ValidationErrors} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {Donation} from "../../donation-management/donation";
import {Donor} from "../../donor-management/Donor";
import {Router} from "@angular/router";
import {tap} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import * as XLSX from 'xlsx';
import {LoginService} from "../../login/login.service";
import {error} from "@angular/compiler-cli/src/transformers/util";


@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css']
})
export class CampaignComponent implements OnInit {




  // @ts-ignore
  campaignDialog: boolean;
  // @ts-ignore
  campaignDialog1: boolean;

  selectedCampaign: any;

  errorMessage:any
  campaignErrors: { [campaignId: string]: string } = {};




  // @ts-ignore
  campaignList : Campaign[];

  // @ts-ignore
  donorList: Donor[];

  // @ts-ignore
  donationsList: Donation[];

  // @ts-ignore
  selectedCampaigns: Campaign[];

  // campaign: Campaign;

  campaign:{id:number,name:string, purpose:string} ={id:0,name: '', purpose:''}
  auxcampaign:{id:number,name:string, purpose:string} ={id:0,name: '', purpose:''}



  // @ts-ignore
  submitted: boolean;
  Delete: any;
  summary2: string = '';

  constructor(private campaignService: CampaignService,private messageService: MessageService, private router:Router,private translate: TranslateService
              ,private cdr: ChangeDetectorRef,private http: HttpClient,private confirmationService: ConfirmationService, private loginService: LoginService) { }

  ngOnInit() {
    console.log("start campaign manager")
    this.campaignService.loadCampaigns().subscribe();
    this.campaignService.getCampaigns().subscribe((campaigns) => this.campaignList = campaigns);
    console.log("no error")


  }

  openNew() {
    this.campaign ={id:0,name: '', purpose:''};
    this.submitted = false;
    this.campaignDialog = true;
  }
  hideDialog1() {
    this.campaignDialog1 = false;
    this.submitted = false;
    this.campaign = {id: 0, name: '', purpose: ''}
    window.location.reload()
    return false
  }
  hideDialog() {
    this.campaignDialog = false;
    this.submitted = false;
    this.campaign = {id: 0, name: '', purpose: ''}


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


  saveCampaign() {
    this.submitted = true;
    console.log(this.campaign.name);
    console.log(this.campaign.purpose);

    if (this.campaign.name && this.campaign.purpose && this.campaign.name.replace(/\s/g, '').length > 0) {
      const newCampaign = new Campaign(
        this.removeExcessiveWhitespace(this.campaign.name),
        this.removeExcessiveWhitespace(this.campaign.purpose)
      );

      return this.campaignService.saveCampaignToDB(newCampaign).pipe(tap(


      )).subscribe(
         (camp) => {

          console.log(camp)
          this.campaignList.push(camp)
          this.campaignDialog = false;
          this.campaign = {id: 0, name: '', purpose: ''};
          this.showSuccessAdd("Added successfully");

      },
        (error)=>{
           console.log(error.error.text)
          this.showError(error.error.text)
        }
      )

    } else {
      console.warn('Campaign name or purpose cannot be empty.');
      this.errorMessage = "Campaign name or purpose cannot be empty.";

      return
    }
  }


  openEdit(campaign: any) {
    this.selectedCampaign = campaign;
    this.auxcampaign=Object.assign({}, this.selectedCampaign);
    console.log(this.auxcampaign)
    this.campaign=campaign
    console.log(this.selectedCampaign.id)
    this.submitted = false;
    this.campaignDialog1 = true;

  }

  editCampaign() {
    this.submitted = true;

    const campaign = this.selectedCampaign
    // this.campaign = {...(campaign)};
    console.log(campaign.id)
    console.log(this.campaign.name)
    console.log(this.campaign.purpose)
    if (this.campaign.name && this.campaign.purpose && this.campaign.name.replace(/\s/g, '').length > 0) {
      const newCampaign = new Campaign(
        this.removeExcessiveWhitespace(this.campaign.name),
        this.removeExcessiveWhitespace(this.campaign.purpose)
      );


       return this.campaignService.updateCampaignFromDB(this.selectedCampaign.id.toString(), newCampaign).subscribe(
        response => {
          console.log('edited successfully:', response);
          // window.location.reload()
          this.campaignDialog1 = false;
          this.showSuccessAdd("Modified successfully")

        },
        error => {

          console.error('Error editing campaign:', error.error);
          const errorMessage = error.error.text;
          this.showError(errorMessage.toString());

        }
      )
    }
    else {
      console.warn('Campaign name or purpose cannot be empty.');
      this.errorMessage = "Campaign name or purpose cannot be empty.";
    }
    return


  }


    deleteCampaign(campaign: any) {
     console.log('deleting')
     // const userConfirmed = await this.confirm();
     if (confirm("Are you sure you want to delete this campaign?")) {
     // if (userConfirmed) {
       const idd = campaign.id;
       console.log(idd)
       return this.campaignService.deleteFromDB(idd.toString()).subscribe(
         response => {
           console.log('Deleted successfully:', response);
           this.campaignErrors[campaign.id] = '';
           this.campaignList = this.campaignList.filter(camp => camp.id !== idd);
           this.showSuccessAdd('Deleted successfully:')


         },
         error => {
           this.campaignErrors[campaign.id] = error.error.text;
           console.error('Error deleting campaign:', error.error);
           this.showError(error.error.text)
         }
       );
     }
     return;


   }



   deleteSelectedCampaigns() {

    if (confirm("Are you sure you want to delete this campaign?")) {
      this.selectedCampaigns.forEach(campaign => {
        const idd = campaign.id;
        console.log(idd);

        return this.campaignService.deleteFromDB(idd.toString()).subscribe(
          response => {
            console.log('Deleted successfully:', response);
            this.campaignErrors[campaign.id] = ''; // Clear the error message if deletion was successful
            this.campaignList = this.campaignList.filter(camp => camp.id !== idd);
            // this.campaignList.splice(idd, 1);
            this.showSuccessAdd('Deleted successfully:')

          },
          error => {
            this.campaignErrors[campaign.id] = error.error.text;
            console.error('Error deleting campaign:', error.error);
            this.showError(error.error.text)
          });

      })
    }
    return
  }





  private showError(message:string) {
    this.messageService.add({
      severity: 'error', // Severity level for styling (success, info, warn, error)
      summary: 'Error',
      detail: message,
      life: 1500 // Duration in milliseconds
    });


  }
  checkIfCanExport():boolean{
    const userPermissions: Array<string> = this.loginService.getLoggedUserPermissions();


    return  userPermissions.includes("CAMP_REPORTING");

  }

  checkIfReporter():boolean{ //check if user is reporter for restricted visualization
    const userPermissions: Array<string> = this.loginService.getLoggedUserPermissions();


    return (userPermissions.includes("CAMP_REPORT_RESTRICTED") || userPermissions.includes("CAMP_REPORTING"))  && !userPermissions.includes("CAMP_MANAGEMENT") ;

  }

  campaignDonations(id:number):Donation[]{
    this.campaignService.loadDonations(id.toString()).subscribe(donations=>this.donationsList=donations);
    console.log("donations added")
    return this.donationsList;
  }


  campaignDonors(id : number):Donor[] {
    this.campaignService.loadDonators(id.toString()).subscribe(donors=> this.donorList=donors);
    console.log("donors added")
    return this.donorList
  }


  fullTextMap: Record<string, boolean> = {};  //daca textul e full sau truncat
  toggleFullText(donor: any, field: string): void {
    this.fullTextMap[field] = !this.fullTextMap[field];
  }

  getDisplayText(text: string): string {
    const maxLength = 12; // Adjust as needed
    if (text.length > maxLength && !this.fullTextMap[text]) {
      return text.substring(0, maxLength - 3) + '...';
    }
    return text;
  }



  exportStyledCampaignsWithDonators(): void {
    this.campaignService.getCampaignsWithDonators().subscribe(data => {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data.map(item => ({
        'Campaign Name': item.campaign.name,
        'Donator Names': item.donators.map(d => d.firstName + ' ' + d.lastName).join(', ')
      })));

      // Example of adding some basic styling
      if (!ws['!cols']) ws['!cols'] = [];
      ws['!cols'][0] = { width: 20 }; // Set width for the first column
      ws['!cols'][1] = { width: 40 }; // Set width for the second column

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      XLSX.writeFile(wb, 'campaigns_with_donators.xlsx');
    });
  }



}
