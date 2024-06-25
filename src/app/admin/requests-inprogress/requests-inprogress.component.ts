import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DemandesServicesService } from 'src/app/services/demandes-services.service';
import Swal from 'sweetalert2';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import * as saveAs from 'file-saver';


@Component({
  selector: 'app-requests-inprogress',
  templateUrl: './requests-inprogress.component.html',
  styleUrls: ['./requests-inprogress.component.css']
})
export class RequestsInprogressComponent {
 
  dataArray: any;

  messageErr: any;

  updaterequests: UntypedFormGroup;

  searchedKeyword: any ;

  p : any = 1 ;
  user: any;
  hasSicknessReason: any;


  constructor(private demandesServicesService:DemandesServicesService,private router:Router) {
    this.user = JSON.parse(sessionStorage.getItem('user')!);

    this.demandesServicesService.getrequestinprogressbyemployee(this.user.user.company_id).subscribe(data=>{
      // debugger
    //  sessionStorage.setItem( 'requestdetails', JSON.stringify( data ) );

      console.log(data)
      this.dataArray=data
     , (err:HttpErrorResponse)=>{
      this.messageErr="We dont't found this demande in our database"}
    }) 
    
    this.updaterequests = new UntypedFormGroup({
      status: new UntypedFormControl('', [Validators.required]),
      motif_refused: new UntypedFormControl('', [Validators.required]),
      user_id: new UntypedFormControl('', [Validators.required]),
      
    });

  }


  exportPdf(requestId: number , email:any ): void {
    this.demandesServicesService.exportPdf(requestId, email ).subscribe(blob => {
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

  delete(id: any, i: number) {
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
          console.log(response)
          this.dataArray.splice(i, 1)


        })
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        window.location.reload();


      }
    })


  }

  dataRequest = {
    id: '',
    status: '',
    start_date: '',
    end_date: '',
    user_id: '',
    reason:'' ,
    motif_refused : '',
    email: ''

  }

  getdata(status: string,  start_date: string, end_date: string, reason: string , motif_refused:any, user_id :any , id: any, email: any) {
 
    this.dataRequest.status = status

    this.dataRequest.start_date = start_date
    this.dataRequest.end_date = end_date
    this.dataRequest.reason = reason
    this.dataRequest.motif_refused = motif_refused
    this.dataRequest.id = id
    this.dataRequest.user_id = user_id
    this.dataRequest.email = email


    console.log(this.dataRequest)

  }

  updaterequest(f: any) {
    let data = f.value
    const formData = new FormData();
    formData.append('status', this.updaterequests.value.status);

    formData.append('motif_refused', this.updaterequests.value.motif_refused);
    formData.append('user_id', this.updaterequests.value.user_id);

    this.demandesServicesService.updateRequest(this.dataRequest.id, formData).subscribe((response: any) => {

      console.log(response)
     
      Swal.fire('Whooa!', 'Request Succeffully updated !', 'success')
     
      window.location.reload();


    }, (err: HttpErrorResponse) => {
      console.log(err.message)
  
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'champs required or not valid !',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      })
    })



  }

  checkForSicknessReason() {
    if (this.dataArray?.requests) {
        this.hasSicknessReason = this.dataArray.requests.some((request: any) => request.reason === 'sickness');
    }
}

}
