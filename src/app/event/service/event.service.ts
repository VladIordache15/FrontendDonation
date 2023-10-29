import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {Eventt} from "../model/Event";
import {EventJob} from "../../eventJob/EventJob";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  url:string = "http://localhost:8080/events";
  eventList$:BehaviorSubject<Eventt[]> = new BehaviorSubject<Eventt[]>([]);


  getEvents():Observable<Eventt[]>{
    return this.http.get<Eventt[]>(this.url +'/all').pipe(tap(event => this.eventList$.next(event)));
  }

  saveEventToDB(event : Eventt):Observable<any>{
    return this.http.post(this.url+'/new',event);
  }

  updateEventFromDB(id:string, newEvent: Eventt):Observable<any>{
    return this.http.put(this.url+'/update/'+id,newEvent);
  }

  deleteEventFromDB(id:string):Observable<any>{
    return this.http.delete(this.url+'/'+id);
  }







  constructor( private http:HttpClient,) { }
}


