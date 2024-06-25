import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DemandesServicesService } from 'src/app/services/demandes-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-reasons',
  templateUrl: './list-reasons.component.html',
  styleUrls: ['./list-reasons.component.css']
})
export class ListReasonsComponent implements OnInit {
  dataArray: any = { reasons: [] };
  messageErr: any;
  searchedKeyword: any;
  p: any = 1;
  updatereasons: UntypedFormGroup;
  dataReason: any = { id: '', name: '' }; // Initialize empty object

  constructor(private demandesServicesService: DemandesServicesService, private router: Router) {
    this.updatereasons = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.fetchAllReasons();
  }

  fetchAllReasons() {
    this.demandesServicesService.getAllReasons().subscribe(data => {
      this.dataArray = data;
      sessionStorage.setItem('reasondetails', JSON.stringify(data));
    }, (err: HttpErrorResponse) => {
      this.messageErr = "We didn't find this request in our database";
    });
  }

  delete(id: any) {
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
        this.demandesServicesService.deleteReason(id).subscribe(response => {
          this.dataArray.reasons = this.dataArray.reasons.filter((reason: any) => reason.id !== id);
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        });
      }
    });
  }

  getdata(name: string, id: any) {
    this.dataReason = { name: name, id: id }; // Assign values to dataReason object
  }

  updatereason(f: any) {
    if (f.valid) {
      let data = { name: f.value.name }; // Adjust with your form fields
      this.demandesServicesService.updateReason(this.dataReason.id, data).subscribe(
        (response: any) => {
          Swal.fire('Success', 'Reason updated successfully!', 'success');
          this.fetchAllReasons(); // Refresh data after update
          window.location.reload();
        },
        (error: HttpErrorResponse) => {
          Swal.fire('Error', 'Failed to update reason!', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Please fill out all required fields!', 'error');
    }
  }
}
