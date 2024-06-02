import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { User } from '../models/user';
import { UsersServicesService } from '../services/users-services.service';
import { Company } from '../models/company';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  messageError: any;
  user: User;
  company: Company;


  constructor(private usersServicesService: UsersServicesService, private router: Router) {
    this.user = {
      email: '',
      password: '',

    };
    this.company = {
      name: '',
      subdomain: ''
    }
  }

  register() {
    const data = {
      user: {
        email: this.user.email,
        password: this.user.password,
        company: {
          name: this.company.name, // Ensure to use 'name' instead of 'companyName'
          subdomain: this.company.subdomain
        }
      }
    };

    this.usersServicesService.registerAdmin(data).subscribe(
      response => {
        console.log(response);
        if (response.status == 401) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'User Not Found Or invalide Credentials'
          });
        } else {
          if (response.status == 200) {
            console.log(response);
            this.router.navigate(['/']);
          } else {
            Swal.fire('Whooa !', 'Account succeffully created !', 'success')

          }
        }
      },
      (err: HttpErrorResponse) => this.messageError = err.error.error
    );
  }
}
