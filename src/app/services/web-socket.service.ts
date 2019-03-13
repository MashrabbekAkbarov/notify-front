import { Injectable } from '@angular/core';
import * as Sock from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  constructor() {}
  // Open connection with the back-end socket
  public connect() {
    const socket = new Sock(`http://localhost:8080/socket`);
    const stompClient = Stomp.over(socket);
    return stompClient;
  }
}
