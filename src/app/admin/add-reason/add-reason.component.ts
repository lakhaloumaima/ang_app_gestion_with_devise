import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DemandesServicesService } from 'src/app/services/demandes-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-reason',
  templateUrl: './add-reason.component.html',
  styleUrl: './add-reason.component.css'
})
export class AddReasonComponent implements OnInit {

  selectedFile: File | null = null;

  dataArray: any;

  user: any;

  addReasonn: UntypedFormGroup;

  date: any;

  constructor(private demandesServicesService: DemandesServicesService, private router: Router) {

    this.addReasonn = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required]),
    });

   }

  ngOnInit(): void {
  }

  addReason(f: any) {
    const formData = new FormData();

    formData.append('name', this.addReasonn.value.name);

    let data = f.value

    console.log(data)

    this.demandesServicesService.addReason(formData).subscribe(() => {

      Swal.fire({
        icon: 'success',
        title: 'Success...',
        text: 'Saved !',

        showConfirmButton: true,
        timer: 1500
      })

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


}
