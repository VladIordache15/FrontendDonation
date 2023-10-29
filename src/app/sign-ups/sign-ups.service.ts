import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {EventJob} from "../eventJob/EventJob";
import {SignUp} from "./SignUp";

@Injectable({
  providedIn: 'root'
})
export class SignUpsService {

  constructor(private http:HttpClient) { }
  signUpsList$:BehaviorSubject<SignUp[]> = new BehaviorSubject<SignUp[]>([]);
  url1:string = "http://localhost:8080/signups/all/";

  getSignUps(id: string):Observable<SignUp[]>{
    return this.http.get<SignUp[]>(this.url1+id).pipe(tap(su=>this.signUpsList$.next(su)))

  }


}
