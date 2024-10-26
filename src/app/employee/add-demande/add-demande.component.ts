import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import * as moment from 'moment';
import { DemandesServicesService } from 'src/app/services/demandes-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-demande',
  templateUrl: './add-demande.component.html',
  styleUrls: ['./add-demande.component.css']
})
export class AddDemandeComponent {

  dataArray: any;

  employeedata: any;

  addrequestt: UntypedFormGroup;

  date: any;

  constructor(private demandesServicesService: DemandesServicesService, private router: Router) {

    this.employeedata = JSON.parse(sessionStorage.getItem('employeedata')!);
    console.log(this.employeedata.id);

    this.addrequestt = new UntypedFormGroup({

      start_date: new UntypedFormControl('', [Validators.required]),
      end_date: new UntypedFormControl('', [Validators.required]),
      reason: new UntypedFormControl('', [Validators.required]),
      description: new UntypedFormControl('', [Validators.required])


    });

  }

  addRequestt(f: any) {
    const formData = new FormData();

    formData.append('start_date', this.addrequestt.value.start_date);
    formData.append('end_date', this.addrequestt.value.end_date);
    formData.append('reason', this.addrequestt.value.reason);
    formData.append('description', this.addrequestt.value.description);
    formData.append('user_id', this.employeedata.id);

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



}
