import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const SERVER_URL = 'http://localhost:10000/socket';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  constructor(private http: HttpClient) {}

  public sendSubscriptionToServer(subscription: PushSubscription) {
    return this.http.post(SERVER_URL, subscription);
  }
}
