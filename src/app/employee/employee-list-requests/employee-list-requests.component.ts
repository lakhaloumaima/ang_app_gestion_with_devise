import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DemandesServicesService } from 'src/app/services/demandes-services.service';
import { UsersServicesService } from 'src/app/services/users-services.service';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-employee-list-requests',
  templateUrl: './employee-list-requests.component.html',
  styleUrls: ['./employee-list-requests.component.css']
})
export class EmployeeListRequestsComponent implements OnInit {
  dataArrayy: any;
  messageErr: any;
  dataArray: any;
  searchedKeyword: any;
  p: any = 1;
  user: any;
  updaterequest: any;
  requestdetails: any;
  dataArrayyy: any;
  date: any;
  selectedFile: File | null = null;
  reasons: any;

  constructor(private demandesServicesService: DemandesServicesService, private usersServicesService: UsersServicesService, private router: Router) {
    this.user = JSON.parse(sessionStorage.getItem('user')!);

    this.requestdetails = JSON.parse(sessionStorage.getItem('requestdetails')!);

    this.usersServicesService.countAllForAdmin(this.user.user.company_id).subscribe(result => {
      this.dataArrayy = result;
      console.log(this.dataArrayy);
    }, (err: HttpErrorResponse) => {
      this.messageErr = "We don't found in our database";
    });

    this.updaterequest = new UntypedFormGroup({
      start_date: new UntypedFormControl('', [Validators.required]),
      end_date: new UntypedFormControl('', [Validators.required]),
      reason_id: new UntypedFormControl('', [Validators.required]),
      description: new UntypedFormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {

    this.demandesServicesService.getAllReasons().subscribe(data => {
      this.reasons = data.reasons; // Assuming data contains an array of reasons
      console.log( this.reasons )
    }, (err: HttpErrorResponse) => {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Failed to fetch reasons list!',
        showConfirmButton: true,
        timer: 1500
      });
    });

    this.demandesServicesService.getRequestsByID(this.user.id).subscribe(data => {
      sessionStorage.setItem('requestdetails', JSON.stringify(data));
      console.log(data);
      this.dataArray = data;
    }, (err: HttpErrorResponse) => {
      this.messageErr = "We don't found this request in our database";
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  importPdf(requestId: number): void {
    if (this.selectedFile) {
      this.demandesServicesService.importPdf(requestId, this.selectedFile).subscribe(
        response => {
          console.log( response )
          Swal.fire({
            icon: 'success',
            title: 'Import Successful',
            text: 'PDF has been uploaded successfully!',
            showConfirmButton: true,
            timer: 1500
          });
          window.location.reload()
        },
        (error: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Import Failed',
            text: 'Could not upload PDF. Please try again later.',
            showConfirmButton: true,
            timer: 1500
          });
        }
      );
    }
  }

  exportPdf(requestId: number , email:any ): void {
    this.usersServicesService.exportPdf(requestId, email ).subscribe(blob => {
      saveAs(blob, `certificate_${requestId}_${email}.pdf`);
    }, (err: HttpErrorResponse) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Not have certificate !',
        showConfirmButton: false,
        timer: 1500
      });
    });
  }

  delete(id: any, i: number): void {
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
        this.demandesServicesService.deleteRequest(id).subscribe(response => {
          console.log(response);
          this.dataArray.splice(i, 1);
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        window.location.reload();
      }
    });
  }

  dataRequest = {
    id: '',
    start_date: '',
    end_date: '',
    reason_id: '',
    description: ''
  }

  getdata(start_date: string, end_date: string, reason_id: string, description: string, id: any): void {
    this.dataRequest.start_date = start_date;
    this.dataRequest.end_date = end_date;
    this.dataRequest.reason_id = reason_id;
    this.dataRequest.description = description;
    this.dataRequest.id = id;
    console.log(this.dataRequest);
  }

  updaterequests(f: any): void {
    let data = f.value;
    const formData = new FormData();
    formData.append('start_date', this.updaterequest.value.start_date);
    formData.append('end_date', this.updaterequest.value.end_date);
    formData.append('reason_id', this.updaterequest.value.reason_id);
    formData.append('description', this.updaterequest.value.description);
    if (this.selectedFile) {
      formData.append('certificate', this.selectedFile, this.selectedFile.name);
    }

    this.date = moment(Date.now()).format("YYYY-MM-DD");
    if (data.start_date > this.date) {
      if (data.start_date <= data.end_date) {
        this.demandesServicesService.updateRequestByEmployee(this.dataRequest.id, formData).subscribe((response: any) => {
          console.log(response);
          Swal.fire('Whooa!', 'Request Successfully updated!', 'success');
          window.location.reload();
        }, (err: HttpErrorResponse) => {
          console.log(err.message);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Champs required or not valid!',
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
}
