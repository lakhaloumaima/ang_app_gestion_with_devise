// action-cable.service.ts
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class ActionCableService {
  private cable: any; // Adjust the type if needed

  constructor(private socket: Socket) {
    // Subscribe to the 'chat_channel' (replace with your channel name)
    this.cable = this.socket.fromEvent('messages_channel');
  }

  // Add methods for interacting with Action Cable as needed
}
