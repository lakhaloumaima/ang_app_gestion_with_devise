import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../models/user';
import { UsersServicesService } from '../services/users-services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  messageError: any;

  user: User = {
    email: '',
    password: '',
  };

  constructor(private usersServicesService: UsersServicesService, private router: Router) {
    // sessionStorage.clear();
  }

  login() {
    const data = {
      user: {
        email: this.user.email,
        password: this.user.password,
      }
    };

    this.usersServicesService.login(data).subscribe(
      response => {
        if (response.status == 401) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'User Not Found Or Invalid Credentials'
          });
        } else {
          const returnUrl = response.redirect_url;
          const subdomain = this.extractSubdomain(returnUrl);
          console.log( window.location.hostname )
          sessionStorage.setItem('user', JSON.stringify(response));

          // window.location.href = `http://${subdomain}.localhost:4200/dashboard-${response.role}`;

          if (response.role == "admin" ) {

            sessionStorage.setItem('user', JSON.stringify(response));
            window.location.href = `http://${subdomain}.localhost:4200/dashboard-admin`;

          }
          else if (response.role == "employee" && subdomain === response.subdomain) {
            sessionStorage.setItem('user', JSON.stringify(response));
            window.location.href = `http://${subdomain}.localhost:4200/dashboard-employee`;
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Invalid Subdomain or Role'
            });
          }
        }
      },
      (err: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.message
        });
      }
    );
  }

  private extractSubdomain(url: string): string {
    // Remove the protocol and split the URL by dots
    const parts = url.replace(/^https?:\/\//, '').split('.');
    
    // The first part will be the subdomain
    return parts[0];
  }
}
