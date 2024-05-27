// src/app/chat.service.ts
import { Injectable } from '@angular/core';
import { createConsumer } from '@rails/actioncable';
import { SocketService } from './socket-service.service';
import { UsersServicesService } from './users-services.service';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // admindata:any;
  private cable: any;

  constructor(private http: HttpClient, private socket: Socket) {
    // this.admindata = JSON.parse(sessionStorage.getItem('admindata')!);

  }


  createMessage(message: { message: string }) {
    return this.http.post<any>('http://localhost:3000/messages', message );
  }

  sendMessage(message: string) {
    this.socket.emit('ChatChannel', message);
  }

  receiveMessage() {
    return this.socket.fromEvent('ChatChannel');
  }

  connectToActionCable() {
    this.cable = createConsumer('ws://localhost:3000/cable');
    const subscription = this.cable.subscriptions.create('ChatChannel', {
      received(data: any) {
        console.log('Message received from server:', data.content);
        // You can emit the received message to the socket for the components to listen to
        // this.socket.emit('message', data.content);
      }
    });
  }

  getMessages() {
    return this.http.get<any[]>('http://localhost:3000/messages');
  }

}
