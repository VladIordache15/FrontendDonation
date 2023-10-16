import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, timer, throwError } from "rxjs";
import { switchMap, retry, takeUntil } from "rxjs/operators";
import { NotificationDTO } from "./NotificationDTO";
import * as Stomp from 'stompjs';
import * as SockJS from "sockjs-client";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly API_URL = 'http://localhost:8080/api/notify/';

  private stopPollingForNotifications = new Subject<void>();
  private stopPollingForAllNotifications = new Subject<void>();
  private webSocket!: WebSocket;
  private notificationsSubject: Subject<NotificationDTO> = new Subject<NotificationDTO>();
  private notificationsSubjectView: Subject<NotificationDTO> = new Subject<NotificationDTO>();
  stompClient: Stomp.Client | null;


  constructor(private http: HttpClient) {
    this.stompClient = null;

  }

  getNotificationsNotAppearedOnView(userId: number): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(this.API_URL + userId);
  }

  markNotificationAsRead(notificationId: string): Observable<void> {
    return this.http.put<void>(`http://localhost:8080/api/notifications/${notificationId}`, {});
  }





  getAllNotifications(userId: number): Observable<NotificationDTO[]> {
    console.log(userId)
    return this.http.get<NotificationDTO[]>(`http://localhost:8080/api/inbox/${userId}`);
  }


















}
