import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PushNotification } from '../interfaces/push-notification';

export declare type Permission = 'denied' | 'granted' | 'default';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  public permission: Permission;

  constructor(private http: HttpClient) {
    this.permission = this.isSupported() ? 'default' : 'denied';
  }

  public isSupported(): boolean {
    return 'Notification' in window;
  }

  requestPermission() {
    const self = this;
    if ('Notification' in window) {
      Notification.requestPermission(function(status) {
        console.log({ status });
        return (self.permission = status);
      });
    }
  }

  create(title: string, options?: PushNotification): any {
    const self = this;
    return new Observable(function(obs) {
      if (!('Notification' in window)) {
        console.log('Notifications are not available in this environment');
        obs.complete();
      }
      if (self.permission !== 'granted') {
        console.log(
          'The user hasn\'t granted you permission to send push notifications'
        );
        obs.complete();
      }
      const _notify = new Notification(title, options);
      _notify.onshow = function(e) {
        return obs.next({
          notification: _notify,
          event: e
        });
      };
      _notify.onclick = function(e) {
        return obs.next({
          notification: _notify,
          event: e
        });
      };
      _notify.onerror = function(e) {
        return obs.error({
          notification: _notify,
          event: e
        });
      };
      _notify.onclose = function() {
        return obs.complete();
      };
    });
  }

  generateNotification(source: Array<any>): void {
    const self = this;
    source.forEach(item => {
      const options = {
        body: item.alertContent,
        icon: '../assets/icons/icon-96x96.png'
      };
      const notify = self.create(item.title, options).subscribe();
    });
  }
}
