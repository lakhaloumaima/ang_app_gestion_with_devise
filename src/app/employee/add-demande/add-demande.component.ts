import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DemandesServicesService } from 'src/app/services/demandes-services.service';
import { UsersServicesService } from 'src/app/services/users-services.service';
import Swal from 'sweetalert2';
import { createConsumer } from '@rails/actioncable';

@Component({
  selector: 'app-add-demande',
  templateUrl: './add-demande.component.html',
  styleUrls: ['./add-demande.component.css']
})
export class AddDemandeComponent implements OnInit {
  selectedFile: File | null = null;
  dataArray: any;
  user: any;
  addrequestt: UntypedFormGroup;
  date: any;
  reasons: any[] = []; // Store reasons list
  messageErr: any;
  cable: any;
  notifications: any[] = [];

  constructor(
    private employeesServicesService: UsersServicesService,
    private demandesServicesService: DemandesServicesService,
    private router: Router
  ) {
    this.user = JSON.parse(sessionStorage.getItem('user')!);

    this.addrequestt = new UntypedFormGroup({
      start_date: new UntypedFormControl('', [Validators.required]),
      end_date: new UntypedFormControl('', [Validators.required]),
      reason_id: new UntypedFormControl('', [Validators.required]),
      description: new UntypedFormControl('', [Validators.required]),
      user_id: new UntypedFormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.fetchReasons(); // Fetch reasons list on component initialization

    this.employeesServicesService.getAllEmployeesByCompanyWithoutAdmin(this.user.user.company_id).subscribe(data => {
      console.log(data);
      this.dataArray = data;
    }, (err: HttpErrorResponse) => {
      this.messageErr = "We don't found this employee in our database";
    });

    // Connect to Action Cable when the component initializes
    this.cable = createConsumer('ws://localhost:3000/cable');
    this.cable.subscriptions.create('NotificationChannel', {
      received: (data: any) => {
        console.log('Notification received from server:', data);
        this.notifications.push({ ...data.notification });
      }
    });
  }

  fetchReasons() {
    this.demandesServicesService.getAllReasons().subscribe(data => {
      this.reasons = data.reasons; // Assuming data contains an array of reasons
    }, (err: HttpErrorResponse) => {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Failed to fetch reasons list!',
        showConfirmButton: true,
        timer: 1500
      });
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  addRequestt(f: any) {
    const formData = new FormData();
    formData.append('start_date', this.addrequestt.value.start_date);
    formData.append('end_date', this.addrequestt.value.end_date);
    formData.append('reason_id', this.addrequestt.value.reason_id);
    formData.append('description', this.addrequestt.value.description);
    if (this.user.user.role == "admin") {
      formData.append('user_id', this.addrequestt.value.user_id);
    } else {
      formData.append('user_id', this.user.id);
    }

    if (this.selectedFile) {
      formData.append('certificate', this.selectedFile, this.selectedFile.name);
    }

    let data = f.value;
    console.log(data);

    this.date = moment(Date.now()).format('YYYY-MM-DD');
    if (data.start_date > this.date) {
      if (data.start_date <= data.end_date) {
        this.demandesServicesService.addRequest(formData).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Success...',
            text: 'Saved!',
            showConfirmButton: true,
            timer: 1500
          });
          this.resetForm(); // Reset the form on success
        }, (err: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Fields required or not valid!',
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
          });
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Start Date must be before End Date!',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Start Date must be after current date!',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  resetForm() {
    this.addrequestt.reset(); // Reset the form to its initial state
    this.selectedFile = null; // Clear the selected file
  }

  isCertificateRequired(): boolean {
    const selectedReasonId = this.addrequestt.value.reason_id;
    
    // Find the reason object from this.reasons based on selectedReasonId
    const selectedReason = this.reasons.find(reason => reason.id === selectedReasonId);
    
    // Check if selectedReason is not null and its name is 'sickness' or 'maladie'
    return !!selectedReason && (selectedReason.name === 'sickness' || selectedReason.name === 'maladie');
  }

}
