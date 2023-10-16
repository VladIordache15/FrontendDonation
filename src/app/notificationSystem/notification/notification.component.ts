import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../notification-service.service";
import {MessageService} from "primeng/api";
import {NotificationDTO} from "../NotificationDTO";
import {LoginService} from "../../login/login.service";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Subject} from "rxjs";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: NotificationDTO[] = []
  notifications1: NotificationDTO[] = []
  inbox: NotificationDTO[] =[]
  displaySidebar: boolean = false
  private webSocket!: WebSocket;
  usernamePage: HTMLElement | null;
  chatPage: HTMLElement | null;
  sidebar: HTMLFormElement | null;
  messageForm: HTMLFormElement | null;
  messageInput: HTMLInputElement | null;
  messageArea: HTMLUListElement | null;
  connectingElement: HTMLElement | null;
  stompClient: Stomp.Client | null;


  constructor(private notificationService: NotificationService,
              private messageService: MessageService,
              private loginService: LoginService) {
    this.usernamePage = null;
    this.chatPage = null;
    this.sidebar = null;
    this.messageForm = null;
    this.messageInput = null;
    this.messageArea = null;
    this.connectingElement = null;

    this.stompClient = null;
  }


  ngOnInit() {
    this.usernamePage = document.querySelector('#username-page');
    this.chatPage = document.querySelector('#chat-page');
    this.sidebar = document.querySelector('#notification_sidebar');
    this.messageForm = document.querySelector('#messageForm');
    this.messageInput = document.querySelector('#message');
    this.messageArea = document.querySelector('#messageArea');
    this.connectingElement = document.querySelector('.connecting');
    this.connect()



  }
  connect() {

      const socket = new SockJS('http://localhost:8080/ws');
      this.stompClient = Stomp.over(socket);

      this.stompClient.connect({}, (frame:any) => {
        this.onConnected();
      }, (error) => {
        this.onError(error);
      });

  }
  onConnected() {
    if (this.stompClient) {
      const userId = this.loginService.getLoggedUserId();
      this.stompClient.send("/app/notification.all",{},JSON.stringify({userId: userId}))
      // this.stompClient.send("/app/notification.publish",{},JSON.stringify({userId: userId}))

      this.stompClient.subscribe('/topic/data.response', (response: Stomp.Message) => {
        const responseData = JSON.parse(response.body);

        this.retrieval(responseData);
      });

      this.stompClient.subscribe('/topic/data.publish',(response: Stomp.Message) => {
        const responseData = JSON.parse(response.body);
        console.log(responseData.length)
        for(let i=0;i<responseData.length;i++) {
          this.showNotification(responseData[i]);
        }
      });






    }
  }
  retrieval(lista: NotificationDTO[]) {

    this.inbox=[]
    for (let i = 0; i < lista.length; i++) {

              this.inbox.push(lista[i] as NotificationDTO)

    }
    // console.log(lista)
    // console.log(this.inbox)
  }
  onError(error: any) {
    if (this.connectingElement) {
      this.connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
      this.connectingElement.style.color = 'red';
    }
  }




  showNotification(notification: NotificationDTO): void {
    console.log('afisarwe')
    this.messageService.add({
      severity: 'info',
      summary: `${notification.type}`,
      detail: `Details: ${notification.parameters.join(', ')}`,
      life: 3000, // Toast will stay on screen until user action
      closable: true,
      data: {id: notification.id}  // Store the notification ID here
    })
  }



  toggleSidebar(): void {
    this.messageService.clear()
    // this.onConnected()
    console.log(this.inbox)

    this.displaySidebar = !this.displaySidebar

  }

  markAsRead(notification: NotificationDTO): void {
    this.notificationService.markNotificationAsRead(notification.id).subscribe({
      next: () => {
        console.log('Notification marked as read');
        // Update the local state of the notification
        notification.isRead = true;
      },
      error: (error) => console.error('Error marking notification as read:', error)
    });
  }

  refresh() {
  }
}
