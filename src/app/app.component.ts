import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { PushNotificationService } from './push-notification.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly VAPID_PUBLIC_KEY =
    'BP9KGNI0bBXKbm-77j400e6BR5Re6ULkHfp0M-QmytS3ullXTd8hkY1wAq9OSoGe3UXz9TkkONmzj2huSzP6W6o';

  constructor(
    private swPush: SwPush,
    private pushService: PushNotificationService
  ) {}
  // comment
  subscribeToNotifications() {
    if (this.swPush.isEnabled) {
      this.swPush
        .requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY
        })
        .then(sub => {
          this.pushService.sendSubscriptionToServer(sub).subscribe();
        })
        .catch(err =>
          console.error('Could not subscribe to notifications', err)
        );
    }
  }
}
