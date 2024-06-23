import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersServicesService } from 'src/app/services/users-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {

  dataArray: any;
  messageErr: any;
  searchedKeyword: string = '';
  p: number = 1;
  updateemployees: UntypedFormGroup;
  user: any;
  roleFilter: string = ''; // Initialize role filter
  dataEmployee: any = {
    id: '',
    email: '',
    password: '',
    last_name: '',
    first_name: '',
    address: '',
    phone: '',
    solde: 20,
  };

  constructor(private employeesServicesService: UsersServicesService, private router: Router) {
    this.user = JSON.parse(sessionStorage.getItem('user')!);
    console.log(this.user);

    this.updateemployees = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required]),
      last_name: new UntypedFormControl('', [Validators.required]),
      first_name: new UntypedFormControl('', [Validators.required]),
      address: new UntypedFormControl('', [Validators.required]),
      phone: new UntypedFormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeesServicesService.getAllUsersByCompany(this.user.user.company_id).subscribe(
      (data) => {
        this.dataArray = data; // Update the employees array
      },
      (err: HttpErrorResponse) => {
        console.error('Error fetching employees:', err);
        this.messageErr = "We didn't find any employees in our database.";
      }
    );
  }

  applyRoleFilter(role: string): void {
    if (role === '') {
      this.loadEmployees(); // Load all employees if role filter is empty
    } else {
      this.employeesServicesService.getEmployeesByRole(role, this.user.user.company_id).subscribe(
        (data) => {
          this.dataArray = data; // Update employees based on role
        },
        (err: HttpErrorResponse) => {
          console.error(`Error fetching ${role} employees:`, err);
          // Handle error
        }
      );
    }
  }

  delete(id: string, i: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeesServicesService.deleteEmployee(id).subscribe(response => {
          console.log(response);
          this.dataArray.employees.splice(i, 1); // Remove the employee from the array
          Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
        }, (err: HttpErrorResponse) => {
          console.error('Error deleting employee:', err);
        });
      }
    });
  }

  getdata(email: string, last_name: string, first_name: string, address: string, phone: any, id: any): void {
    this.dataEmployee = { email, last_name, first_name, address, phone, id };
    console.log(this.dataEmployee);
  }

  getdata2(email: string, solde: number, id: any): void {
    this.dataEmployee = { email, solde, id };
    console.log(this.dataEmployee);
  }

  updateemployee(f: any): void {
    const formData = new FormData();
    Object.keys(this.updateemployees.controls).forEach(key => {
      formData.append(key, this.updateemployees.controls[key].value);
    });

    this.employeesServicesService.updateEmployee(this.dataEmployee.id, formData).subscribe((response: any) => {
      console.log(response);
      Swal.fire('Whooa!', 'Employee successfully updated!', 'success');
      this.loadEmployees();
    }, (err: HttpErrorResponse) => {
      console.error('Error updating employee:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fields required or not valid!',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      });
    });
  }
}
