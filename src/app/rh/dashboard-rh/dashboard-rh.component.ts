import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DemandesServicesService } from 'src/app/services/demandes-services.service';
import { UsersServicesService } from 'src/app/services/users-services.service';
import Swal from 'sweetalert2';

import * as moment from 'moment';
@Component({
  selector: 'app-dashboard-rh',
  templateUrl: './dashboard-rh.component.html',
  styleUrl: './dashboard-rh.component.css'
})
export class DashboardRhComponent {

  dataArray: any;
  dataArrayy: any;

  messageErr: any;
  searchedKeyword: any;
  dataArrayyy: any
  p: any = 1 ;

  user: any;


  constructor(private demandesServicesService: DemandesServicesService, private usersServicesService: UsersServicesService, private router: Router) {

    this.user = JSON.parse(sessionStorage.getItem('user')!);

    this.demandesServicesService.getAllRequestsByCompany(this.user.user.company_id).subscribe(data => {
  
      console.log(data)
      this.dataArray = data

        , (err: HttpErrorResponse) => {
          this.messageErr = "We dont't found this request in our database"
        }
    })

    this.usersServicesService.getAllEmployeesByCompany(this.user.user.company_id).subscribe(data => {
      console.log(data)
      this.dataArrayyy = data
        , (err: HttpErrorResponse) => {
          this.messageErr = "We dont't found this employee in our database"
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
