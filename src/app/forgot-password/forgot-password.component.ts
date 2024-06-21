import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsersServicesService } from '../services/users-services.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  logo: any = "./assets/lg.png";
  resetemaillink!: UntypedFormGroup;
  messageSuccess = '';
  messageErr = ''
  constructor(private usersServicesService: UsersServicesService, private route: Router) {

    this.resetemaillink = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required])
    });

  }


  sendresetlinkk(f: any) {

    const formData = new FormData();
    formData.append('email', this.resetemaillink.value.email);
    let data = f.value

    this.usersServicesService.sendResetLink(formData).subscribe((response: any) => {

      if ( response.status == 'ok' ) {
        Swal.fire('Reset Link Sent Avec Succes !', '', 'success')
      }

      else {
        Swal.fire('Reset Link Not Sent !', '', 'error')

      }

    }, (err: HttpErrorResponse) => {
      this.messageErr = err.error
      console.log(err.error)
      console.log(err.status)

    });
  }


}
