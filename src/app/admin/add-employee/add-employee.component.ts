import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debug } from 'console';
import { UsersServicesService } from 'src/app/services/users-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {

  messageError: any
  registerr: any;
  current_user: any;

  constructor(private usersServicesService: UsersServicesService, private router: Router) {

    this.registerr = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required]),
      role: new UntypedFormControl('', [Validators.required]),
      first_name: new UntypedFormControl('', [Validators.required]),
      last_name: new UntypedFormControl('', [Validators.required]),
      cin: new UntypedFormControl('', [Validators.required]),
      phone: new UntypedFormControl('', [Validators.required]),
      address: new UntypedFormControl('', [Validators.required]),
      company_id: new UntypedFormControl('', [Validators.required]),

    });

  }

  ngOnInit(): void {

    this.current_user = JSON.parse(sessionStorage.getItem('user')!);

  }

  register(f: any) {
    let data = f.value

    const formData = new FormData();
 
    formData.append('email', this.registerr.value.email);
    formData.append('password', this.registerr.value.password);
    formData.append('role', 'employee' );
    formData.append('company_id', this.current_user.user.company_id );

    formData.append('phone', this.registerr.value.phone);
    formData.append('first_name', this.registerr.value.first_name);
    formData.append('last_name', this.registerr.value.last_name);
    formData.append('address', this.registerr.value.address);
    formData.append('phone', this.registerr.value.phone);

    if (data.email.length !== 0 || data.password.length !== 0) {
      this.usersServicesService.registerEmployee(formData).subscribe(data => {
        Swal.fire('Whooa !', 'Account succeffully created !', 'success')
        // this.router.navigate(['/login'])
        // this.messageError = "Employee successfully added !"

        console.log(data)
      }, (err: HttpErrorResponse) => {


        console.log(err)
        Swal.fire('Oups !', 'Parameter invalid !', 'error')
        // this.messageError = "Email taken"

      })
    }
    else {
      this.messageError = "Champs rquired"

    }



  }
}
