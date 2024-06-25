import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DemandesServicesService } from 'src/app/services/demandes-services.service';
import { UsersServicesService } from 'src/app/services/users-services.service';
import Swal from 'sweetalert2';

import * as moment from 'moment';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent  {

  dataArray: any;
  dataArrayy: any;
  dataArrayyy: any;

  messageErr: any;
  searchedKeyword: any;

  p: any = 1 ;

  user: any;
  notifications: any;


  constructor(private demandesServicesService: DemandesServicesService, private usersServicesService: UsersServicesService, private router: Router) {

    this.user = JSON.parse(sessionStorage.getItem('user')!);

    this.usersServicesService.getAllEmployeesByCompany(this.user.user.company_id).subscribe(data => {
      console.log(data)
      this.dataArrayyy = data
        , (err: HttpErrorResponse) => {
          this.messageErr = "We dont't found this employee in our database"
        }
    })

    this.usersServicesService.getNotifications(this.user.user.id).subscribe(
      notifications => {
        this.notifications = notifications;
        console.log( this.notifications )
      },
      error => {
        console.error('Error loading notifications:', error);
      }
    );

    this.demandesServicesService.getAllRequestsByCompany(this.user.user.company_id).subscribe(data => {

      console.log(data)
      this.dataArray = data

        , (err: HttpErrorResponse) => {
          this.messageErr = "We dont't found this request in our database"
        }
    })


    this.usersServicesService.countAllForAdmin(this.user.user.company_id).subscribe(result => {
      this.dataArrayy = result

      console.log(this.dataArrayy),

        (err: HttpErrorResponse) => {
          this.messageErr = "We dont't found in our database"
        }
    })

    

  };

  navigateToChat(userId: string) {
    this.router.navigate(['/chat-admin', userId]);
  }

}

