import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersServicesService } from 'src/app/services/users-services.service';
import { createConsumer } from '@rails/actioncable';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent  {

  user: any;
  cable: any;
  notifications: any

  constructor( private usersServicesService: UsersServicesService , private router: Router  ) {
    this.user = JSON.parse(sessionStorage.getItem('user')!);
    console.log(this.user)

    // Initialize Action Cable connection
    this.cable = createConsumer('ws://localhost:3000/cable');
    this.cable.subscriptions.create({ channel: 'NotificationChannel' }, {
      received: (data: any) => {
        console.log('Notification received from server:', data);
        this.notifications.unshift(data.notification); // Add new notification to the beginning of the array
      }
    });

    // this.usersServicesService.getNotifications(this.user.user.id).subscribe(
    //   notifications => {
    //     this.notifications = notifications; // Initialize notifications
    //     console.log('Initial notifications:', this.notifications);
    //   },
    //   error => {
    //     console.error('Error loading notifications:', error);
    //   }
    // );

    this.usersServicesService.getNotifications(this.user.user.id).subscribe(
      data => {
        // this.notifications.unshift(data ); // Add new notification to the beginning of the array

        console.log( data )
        this.notifications = data;
      },
      error => {
        console.error('Error loading notifications:', error);
      }
    );

  }


  logout(){

    this.usersServicesService.logout();
    console.log("log out" )
    sessionStorage.clear()
    window.location.href =  'http://localhost:4200';

  }

}
