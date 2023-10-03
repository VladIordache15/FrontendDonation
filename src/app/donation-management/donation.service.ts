import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {Donation} from "./donation";
import {LoginService} from "../login/login.service";



@Injectable({
  providedIn: 'root'
})
export class DonationService {

  url:string = "http://localhost:8080/donation";

  userId = this.loginService.getLoggedUserId();

  donationList$: BehaviorSubject<Donation[]> = new BehaviorSubject<Donation[]>([]);

  constructor(private http: HttpClient,
              private loginService: LoginService
  ) { }

  loadDonations(): Observable<Donation[]> {
    return this.http.get<Donation[]>(this.url).pipe(tap(donation => this.donationList$.next(donation)));
  }

  getDonations(): Observable<Donation[]> {
    return this.donationList$.asObservable();
  }

  updateDonationDB(id: string, donation: Donation) {
    this.http.put(this.url+"/"+id+"/"+this.userId, donation).subscribe(log=> console.log("update successfull!"));
  }

  saveDonationDB(campaignId: number | undefined, donorId: number | undefined, donationRequest: Donation) {
    console.log(campaignId);
    console.log(donorId);
    console.log(donationRequest);
    console.log(this.userId);
    this.http.post(this.url+'/'+donorId+'/'+campaignId+'/'+ this.userId, donationRequest).subscribe(
       response => {
         console.log('Added successfully: ', response);
       },
       error => {
         console.log(error.status);
         console.log(error.message);
         throw new Error(error.message);
       }
     );
  }

  deleteDonationDB(id: string) {
    return this.http.delete(this.url+'/'+id+'/' + this.userId);//.subscribe(log=>console.log("deleted successfully"))
  }

  approveDonationDB(id: string, donation: Donation) {
    console.log(id);
    console.log(this.userId);
    this.http.patch(this.url + "/" + id + "/" + this.userId, donation).subscribe(log=> console.log("successfull!"));
  }
}
