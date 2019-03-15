import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  PushNotificationService,
  Permission
} from './services/push-notification.service';
import * as Sock from 'sockjs-client';
import * as Stomp from 'stompjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private stompClient: any = null;
  disabled: boolean;
  name: string;
  title: string;
  content: string;
  permission: Permission;

  constructor(private pushService: PushNotificationService) {
    this.pushService.requestPermission();
  }

  ngOnInit(): void {
    this.disabled = true;
    this.permission = this.pushService.permission;
    console.log('Permission: ' + this.pushService.permission);
    setTimeout(() => {
      console.log('Permission after 2 sek: ' + this.pushService.permission);
      if (this.pushService.permission === 'granted') {
        this.connect();
      }
      this.disabled = false;
    }, 2000);
  }

  ngOnDestroy(): void {
    this.disabled = true;
  }

  public connect() {
    const socket = new Sock(`http://localhost:8080/socket`);
    this.stompClient = Stomp.over(socket);
    console.log({ 'stompClient: ': this.stompClient });
    const _this = this;
    _this.stompClient.connect({}, function(frame) {
      console.log('Connected: ' + frame);
      _this.stompClient.subscribe('/topic/notification', function(
        notification
      ) {
        console.log({ 'response: ': JSON.parse(notification.body) });
        _this.showNotification(JSON.parse(notification.body));
      });
    });
  }

  public showNotification(message: any) {
    const data: Array<any> = [];
    // TODO
    data.push(message);
    this.pushService.generateNotification(data);
  }

  public disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected!');
  }

  sendMessage() {
    console.log({
      message: JSON.stringify({ title: this.title, alertContent: this.content })
    });
    this.stompClient.send(
      '/app/notification',
      {},
      JSON.stringify({ title: this.title, alertContent: this.content })
    );
  }
}
