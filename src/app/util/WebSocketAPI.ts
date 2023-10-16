import {AppComponent} from "../app.component";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

export class WebSocketAPI {
  webSocketEndPoint: string = 'http://localhost:8080/ws';
  topic: string = "/topic/greetings";
  stompClient: any;
  appComponent: AppComponent;
  constructor(appComponent: AppComponent){
    this.appComponent = appComponent;
  }
  _connect() {
    console.log("Initialize WebSocket Connection");

    let ws = new SockJS('http://localhost:8080/ws');
  console.log('acci')
    this.stompClient = Stomp.over(<WebSocket>ws);
    console.log('acci')

    this.stompClient.connect({},
      (frame : any) => {
      this.stompClient.subscribe(this.topic,  (sdkEvent: any) => {
        this.onMessageReceived(sdkEvent);
      });
    }, this.errorCallBack);
  };

  onMessageReceived(message : any) {
    console.log("Message Recieved from Server :: " + message);
    this.appComponent.handleMessage(JSON.stringify(message.body));
  }



  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error: any) {
    console.log("errorCallBack sa te fut-> " + error)
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  /**
   * Send message to sever via web socket
   * @param {*} message
   */
  _send(message: any) {
    console.log("calling logout api via web socket");
    this.stompClient.send("/app/hello", {}, JSON.stringify(message));
  }


}
