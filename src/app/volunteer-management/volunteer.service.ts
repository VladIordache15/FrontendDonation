import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Volunteer} from "./Volunteer";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {User} from "../user-administration/models/user";

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {

  url: string="http://localhost:8080/volunteers/"
  volunteersList$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient) { }


  getVolunteers():Observable<Volunteer[]>{
    return this.http.get<Volunteer[]>(this.url+"all").pipe(tap(vol=>this.volunteersList$.next(vol)))
  }

  updateVolunteers(id:string ,vol:Volunteer):Observable<any>{
    return this.http.put<Volunteer>(this.url+'update/'+id, vol)
  }

  addVolunteer(vol:Volunteer):Observable<any>{
    return this.http.post<Volunteer>(this.url+'new',vol)
  }

}
