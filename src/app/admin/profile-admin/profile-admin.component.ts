import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersServicesService } from 'src/app/services/users-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-admin',
  templateUrl: './profile-admin.component.html',
  styleUrls: ['./profile-admin.component.css']
})
export class ProfileAdminComponent {

  user: any;
  imageupdate: UntypedFormGroup;
  image: any;
  upadate: UntypedFormGroup;

  constructor(private usersServicesService: UsersServicesService, private router: Router) {
    this.user = JSON.parse(sessionStorage.getItem('user')!);

    this.imageupdate = new UntypedFormGroup({ 
      avatar: new UntypedFormControl('', [Validators.required]), 
    });

    this.upadate = new UntypedFormGroup({
      first_name: new UntypedFormControl(this.user.user.first_name, [Validators.required]),
      last_name: new UntypedFormControl(this.user.user.last_name, [Validators.required]),
      cin: new UntypedFormControl(this.user.user.cin, [Validators.required]),
      email: new UntypedFormControl(this.user.user.email, [Validators.required]),
      phone: new UntypedFormControl(this.user.user.phone, [Validators.required]),
      address: new UntypedFormControl(this.user.user.address, [Validators.required]),
      password: new UntypedFormControl('', [Validators.required]),
      name: new UntypedFormControl(this.user.user.company.name , [Validators.required]),
      subdomain: new UntypedFormControl(this.user.user.company.subdomain, [Validators.required]),
      solde: new UntypedFormControl(this.user.user.company.solde, [Validators.required]),

    });
  }

  fileChange(event: any) {
    this.image = event.target.files[0];
  }

  updateimage(f: any) {
    const imageformadata = new FormData();
    imageformadata.append('avatar', this.image);

    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersServicesService.updateimageuser(this.user.user.id, imageformadata).subscribe(response => {
          sessionStorage.setItem('user', JSON.stringify(response));
          // window.location.reload();
        }, (err: HttpErrorResponse) => {
          console.log(err.message);
        });

        Swal.fire('Saved!', '', 'success');
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }

  updateinfouser(f: any) {
    const formData = new FormData();
    Object.keys(this.upadate.controls).forEach(key => {
      formData.append(key, this.upadate.get(key)?.value);
    });

    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersServicesService.updateinfouser(this.user.user.id, formData).subscribe(response => {
          sessionStorage.setItem('user', JSON.stringify(response));
          window.location.reload();
        }, (err: HttpErrorResponse) => {
          console.log(err.message);
        });
        Swal.fire('Saved!', '', 'success');
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
}
