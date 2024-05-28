import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { UsersServicesService } from '../services/users-services.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  message: string = '';
  messages: any[] = [];
  newmessage: string = '';
  current_user: any;
  dataArray: any;
  messageErr: any;
  receiver_id: any;
  routeSubscription: any;
  socketSubscription: any;
  count: any;

  constructor(
    private employeesServicesService: UsersServicesService, 
    private chatService: ChatService, 
    private socket: Socket, 
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Fetch current user
    const user = sessionStorage.getItem('user');
    if (user) {
      this.current_user = JSON.parse(user);
    } else {
      // Handle error when user is not found in session storage
      console.error('User not found in session storage');
      return;
    }

    this.fetchMessages();

    // Fetch all employees
    this.employeesServicesService.getAllEmployees().subscribe(
      data => {
        console.log(data);
        this.dataArray = data;
      },
      (err: HttpErrorResponse) => {
        this.messageErr = "We didn't find these employees in our database";
      }
    );

    // Subscribe to changes in route parameters
    this.routeSubscription = this.activatedRoute.params.subscribe(params => {
      this.receiver_id = params['receiver_id'];
      console.log('Receiver ID:', this.receiver_id);
      this.fetchMessages(); // Fetch messages when receiver_id changes
    });

    // Subscribe to real-time messages
    this.socketSubscription = this.socket.fromEvent('message').subscribe((message: any) => {
      this.addMessageToBeginning({ ...message, showTime: false });
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from route and socket subscriptions to avoid memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }

  // Method to fetch messages based on receiver_id
  fetchMessages(): void {
    if (this.receiver_id && this.current_user) {
      // Fetch messages by receiver_id
      this.chatService.getMessagesByReceiverId(this.receiver_id, this.current_user.id).subscribe(
        (receiverMessages: any[]) => {
          // Fetch messages by sender_id
          this.chatService.getMessagesBySenderId(this.current_user.id, this.receiver_id).subscribe(
            (senderMessages: any[]) => {
              // Merge receiver and sender messages
              const allMessages = [...receiverMessages, ...senderMessages];
              // Sort messages by created_at timestamp
              allMessages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime() );
              // Filter out duplicates
              const uniqueMessages = this.getUniqueMessages(allMessages.map(msg => ({ ...msg, showTime: false })));
              this.messages = uniqueMessages;
              this.count = this.messages.length
              console.log( this.messages )
            },
            (error) => {
              console.error('Error fetching sender messages:', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching receiver messages:', error);
        }
      );
    }
  }

  // Method to create a new message
  createMessage(): void {
    const receiver_id = this.receiver_id;
    const sender_id = this.current_user.id;

    if (this.newmessage.trim() !== '') {
      this.chatService.createMessage({ message: this.newmessage, receiver_id, sender_id }).subscribe(
        (response) => {
          console.log('Message created successfully:', response);
          this.fetchMessages();
          this.newmessage = ''; // Clear the input field after creating the message
        },
        (error) => {
          console.error('Error creating message:', error);
        }
      );
    }
  }

  // Method to add a new message to the beginning of the messages array
  addMessageToBeginning(message: any): void {
    // Check for uniqueness before adding
    if (!this.messages.some(msg => msg.id === message.id)) {
      this.messages.unshift(message);
    }
  }

  // Method to remove duplicate messages based on message id
  getUniqueMessages(messages: any[]): any[] {
    const uniqueMessages = [];
    const messageIds = new Set();

    for (const message of messages) {
      if (!messageIds.has(message.id)) {
        uniqueMessages.push(message);
        messageIds.add(message.id);
      }
    }

    return uniqueMessages;
  }
}
