import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {EventJob} from "./EventJob";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EventJobService {
  eventJobsList$:BehaviorSubject<EventJob[]> = new BehaviorSubject<EventJob[]>([]);
  url1:string = "http://localhost:8080/eventJobs/event/";

  getEventJobs(id:string):Observable<EventJob[]>{
    return this.http.get<EventJob[]>(this.url1+id).pipe(tap(ej=>this.eventJobsList$.next(ej)))
  }
  constructor(private http:HttpClient) { }
}
