import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {WebSocketAPI} from "./util/WebSocketAPI";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  languages!: any[];
  selectedLanguage: any;
  username!: string;
  id!: number;
  permissions!: String[];
  webSocketAPI!: WebSocketAPI;
  greeting!: any;
  name!: string;


  constructor(public translate: TranslateService) {
  }

  ngOnInit(): void {
    this.webSocketAPI = new WebSocketAPI(new AppComponent(this.translate));

    this.translate.addLangs(['en', 'ro']);
    this.translate.setDefaultLang('en');

    const browserLang = this.translate.getBrowserLang() || 'en';
    this.translate.use(browserLang.match(/en|ro/) ? browserLang : 'en');

    this.languages = [
      {label: 'EN', code: 'en'},
      {label: 'RO', code: 'ro'}
    ];

    this.selectedLanguage = this.languages.find(lang => lang.code === this.translate.currentLang);
  }

  changeLanguage(langCode: string) {
    this.translate.use(langCode);
  }
  connect(){
    this.webSocketAPI._connect();
  }

  disconnect(){
    this.webSocketAPI._disconnect();
  }

  sendMessage(){
    this.webSocketAPI._send(this.name);
  }

  handleMessage(message : any){
    this.greeting = message;
  }
}
