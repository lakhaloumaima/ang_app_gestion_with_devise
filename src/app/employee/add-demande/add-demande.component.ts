import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import * as moment from 'moment';
import { DemandesServicesService } from 'src/app/services/demandes-services.service';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-add-demande',
  templateUrl: './add-demande.component.html',
  styleUrls: ['./add-demande.component.css']
})
export class AddDemandeComponent {

  selectedFile: File | null = null;

  dataArray: any;

  user: any;

  addrequestt: UntypedFormGroup;

  date: any;

  constructor(private demandesServicesService: DemandesServicesService, private router: Router) {

    this.user = JSON.parse(sessionStorage.getItem('user')!);
    console.log(this.user.id);

    this.addrequestt = new UntypedFormGroup({

      start_date: new UntypedFormControl('', [Validators.required]),
      end_date: new UntypedFormControl('', [Validators.required]),
      reason: new UntypedFormControl('', [Validators.required]),
      description: new UntypedFormControl('', [Validators.required])


    });

  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  addRequestt(f: any) {
    const formData = new FormData();

    formData.append('start_date', this.addrequestt.value.start_date);
    formData.append('end_date', this.addrequestt.value.end_date);
    formData.append('reason', this.addrequestt.value.reason);
    formData.append('description', this.addrequestt.value.description);
    formData.append('user_id', this.user.id);
    if (this.selectedFile) {
      formData.append('certificate', this.selectedFile, this.selectedFile.name);
    }

    let data = f.value

    console.log(data)

    this.date = moment(Date.now()).format("YYYY-MM-DD");
    if (data.start_date > this.date) {

      if (data.start_date <= data.end_date) {

        this.demandesServicesService.addRequest(formData).subscribe(() => {

          Swal.fire({
            icon: 'success',
            title: 'Success...',
            text: 'Saved !',

            showConfirmButton: true,
            timer: 1500
          })

          this.router.navigate(['/employee-list-requests'])

        }, (err: HttpErrorResponse) => {

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'champs required or not valid !',
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
          })
        });


      }

      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Start Date must be before End Date !',

          showConfirmButton: false,
          timer: 1500
        })
      }

    }
    else {

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Start Date must be after current date !',

        showConfirmButton: false,
        timer: 1500
      })
    }

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


}
