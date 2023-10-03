import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, timer, throwError } from "rxjs";
import { switchMap, retry, takeUntil } from "rxjs/operators";
import { NotificationDTO } from "./NotificationDTO";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly API_URL = 'http://localhost:8080/api/notify/';

  private stopPollingForNotifications = new Subject<void>();
  private stopPollingForAllNotifications = new Subject<void>();

  constructor(private http: HttpClient) { }

  getNotificationsNotAppearedOnView(userId: number): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(this.API_URL + userId);
  }

  markNotificationAsRead(notificationId: string): Observable<void> {
    return this.http.put<void>(`http://localhost:8080/api/notifications/${notificationId}`, {});
  }

  pollForNotifications(userId: number): Observable<NotificationDTO[]> {
    return timer(0, 2000).pipe(
      takeUntil(this.stopPollingForNotifications),
      switchMap(() => this.getNotificationsNotAppearedOnView(userId)),
      retry({
        delay: (err) => {
          const isServerError = err?.message.includes('500');
          return isServerError ? timer(10000) : throwError(() => err);
        }
      })
    );
  }

  stopPollingForNotificationsMethod(): void {
    this.stopPollingForNotifications.next();
  }

  getAllNotifications(userId: number): Observable<NotificationDTO[]> {
    console.log(userId)
    return this.http.get<NotificationDTO[]>(`http://localhost:8080/api/inbox/${userId}`);
  }

  pollForAllNotifications(userId: number): Observable<NotificationDTO[]> {
    return timer(0, 2000).pipe(
      takeUntil(this.stopPollingForAllNotifications),
      switchMap(() => this.getAllNotifications(userId)),
      retry({
        delay: (err) => {
          const isServerError = err?.message.includes('500');
          return isServerError ? timer(10000) : throwError(() => err);
        }
      })
    );
  }

  stopPollingForAllNotificationsMethod(): void {
    this.stopPollingForAllNotifications.next();
  }
}
