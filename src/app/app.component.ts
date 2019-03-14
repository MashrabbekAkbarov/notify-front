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
  greetings: string[] = [];
  disabled: boolean;

  name: string;
  title: string;
  message: string;
  permission: Permission;

  constructor(private pushService: PushNotificationService) {
    this.pushService.requestPermission();
  }

  ngOnInit(): void {
    this.disabled = false;
    this.permission = this.pushService.permission;
    console.log('Permission: ' + this.permission);
    if (this.permission === 'granted') {
      this.runNotificationService();
    }
  }

  ngOnDestroy(): void {
    this.disabled = true;
  }

  runNotificationService() {
    this.connect();
  }

  notify() {
    const data: Array<any> = [];
    data.push({
      title: 'Approval',
      alertContent: 'This is First Alert'
    });

    this.pushService.generateNotification(data);
  }

  public connect() {
    const socket = new Sock(`http://localhost:8080/socket`);
    this.stompClient = Stomp.over(socket);
    console.log({ 'stompClient: ': this.stompClient });
    const _this = this;
    _this.stompClient.connect({}, function(frame) {
      _this.setConnected(true);
      console.log('Connected: ' + frame);
      _this.stompClient.subscribe('/topic/hi', function(hello) {
        console.log({ 'response: ': JSON.parse(hello.body).message });
        // _this.showGreeting(JSON.parse(hello.body).message);
        // _this.showNotification();
      });
    });
  }

  public showNotification(message: any) {}

  public disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    this.setConnected(false);
    console.log('Disconnected!');
  }
  public setConnected(connected: boolean) {
    this.disabled = !connected;
    if (connected) {
      this.greetings = [];
    }
  }
  public showGreeting(message) {
    this.greetings.push(message);
  }
  public sendName() {
    this.stompClient.send('/app/hello', {}, this.name);
  }
}
