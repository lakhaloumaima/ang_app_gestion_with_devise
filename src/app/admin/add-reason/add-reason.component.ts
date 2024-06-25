import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DemandesServicesService } from 'src/app/services/demandes-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-reason',
  templateUrl: './add-reason.component.html',
  styleUrls: ['./add-reason.component.css'] // Changed styleUrl to styleUrls
})
export class AddReasonComponent implements OnInit {

  addReasonn: UntypedFormGroup;

  constructor(private demandesServicesService: DemandesServicesService, private router: Router) {
    this.addReasonn = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void { }

  addReason() {
    if (this.addReasonn.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill out the required fields!',
        showConfirmButton: true,
        timer: 1500
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', this.addReasonn.value.name);

    this.demandesServicesService.addReason(formData).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Success...',
        text: 'Saved!',
        showConfirmButton: true,
        timer: 1500
      });
      this.resetForm();  // Reset the form on success

    }, (err: HttpErrorResponse) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Field required or not valid!',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      });
    });
  }

  resetForm() {
    this.addReasonn.reset();  // Reset the form to its initial state
  }

}
