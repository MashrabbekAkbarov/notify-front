import { WebSocketService } from './services/web-socket.service';
import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { PushNotificationService } from './services/push-notification.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private stompClient: any;
  greetings: string[] = [];
  disabled: boolean;
  name: string;

  constructor(
    private pushService: PushNotificationService,
    private webService: WebSocketService,
    private snackBar: MatSnackBar
  ) {
    this.pushService.requestPermission();
    this.stompClient = webService.connect();
  }

  notify() {
    const data: Array<any> = [];
    data.push({
      title: 'Approval',
      alertContent: 'This is First Alert -- By Debasis Saha'
    });
    data.push({
      title: 'Request',
      alertContent: 'This is Second Alert -- By Debasis Saha'
    });
    data.push({
      title: 'Leave Application',
      alertContent: 'This is Third Alert -- By Debasis Saha'
    });
    data.push({
      title: 'Approval',
      alertContent: 'This is Fourth Alert -- By Debasis Saha'
    });
    data.push({
      title: 'To Do Task',
      alertContent: 'This is Fifth Alert -- By Debasis Saha'
    });
    this.pushService.generateNotification(data);
  }

  public connect() {
    this.stompClient.connect({}, function(frame) {
      this.stompClient.subscribe('/topic/hi', function(hello) {
        this.showGreeting(JSON.parse(hello.body).messsage);
      });
    });
  }
  public disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    this.setConnected(false);
    console.log('Disconnected!');
  }
  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings = [];
    }
  }
  showGreeting(message) {
    this.greetings.push(message);
  }
  sendName() {
    this.stompClient.send(
      '/app/hello',
      {},
      JSON.stringify({ name: 'mashrabbek' })
    );
  }
}
