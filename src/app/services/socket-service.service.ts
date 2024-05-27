// socket.service.ts
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
 // private socket;

  fromEvent(arg0: string) {
    throw new Error('Method not implemented.');
  }

  constructor(private socket: Socket) {}

  emit(eventName: string, data: any) {
    // Implement your emit logic here
    this.socket.emit(eventName, data);
  }

  on(eventName: string): any {
    return new Observable((observer) => {
      this.socket.on(eventName, (data: any) => {
        observer.next(data);
      });
    });
  }


  // Add methods for interacting with Socket.IO as needed
}
