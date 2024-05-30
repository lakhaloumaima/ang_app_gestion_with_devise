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
  dataReason: any = { id: '', name: '' };

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
      this.messageErr = "We don't found this request in our database";
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
    this.dataReason.name = name;
    this.dataReason.id = id;
  }

  updatereason(f: any) {
    let data = f.value;
    this.demandesServicesService.updateRequest(this.dataReason.id, data).subscribe(response => {
      Swal.fire('Whooa!', 'Request Successfully updated!', 'success');
      this.fetchAllReasons();
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
  }
}
