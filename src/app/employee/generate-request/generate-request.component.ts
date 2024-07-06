import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandesServicesService } from 'src/app/services/demandes-services.service';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-generate-request',
  templateUrl: './generate-request.component.html',
  styleUrls: ['./generate-request.component.css']
})
export class GenerateRequestComponent {

  dataArray: any;
  messageErr: any;
  requestdetails: any;
  docDefinition: any;
  user: any;

  constructor(private demandesServicesService: DemandesServicesService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.requestdetails = JSON.parse(sessionStorage.getItem('requestdetails')!);
    this.user = JSON.parse(sessionStorage.getItem('user')!);

    this.demandesServicesService.getrequestdata(this.activatedRoute.snapshot.params['id']).subscribe(
      (data: any) => {
        sessionStorage.setItem('requestdetails', JSON.stringify(data));
        console.log(data);
        this.dataArray = data;
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.messageErr = "We don't found this request in our database";
      }
    );
  }

  download() {
    const requestStatus = this.requestdetails[0].status || '';
    const startDate = this.requestdetails[0].start_date || '';
    const endDate = this.requestdetails[0].end_date || '';
    const days = this.requestdetails[0].days || '';
    const reason = this.requestdetails[0].reason?.name || '';
    const description = this.requestdetails[0].description !== 'null' ? this.requestdetails[0].description : '';
    const motifRefused = this.requestdetails[0].motif_refused || '';

    this.docDefinition = {
      content: [
        {
          text: `Date: ${new Date().toLocaleString()}`,
          alignment: 'right'
        },
        {
          text: `Bill No : ${((Math.random() * 1000).toFixed(0))}`,
          alignment: 'right'
        },
        {
          text: 'Request System',
          decoration: 'underline',
          fontSize: 20,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'Employee Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              { text: "Email : " + this.user.user.email },
              { text: "Balance (Days) : " + this.user.user.solde }
            ],
            []
          ]
        },
        {
          text: 'Request Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              { text: "Request Status : " + requestStatus, bold: true },
              { text: "Start_date : " + startDate },
              { text: "End_date : " + endDate },
              { text: "Period (Days) : " + days },
              { text: "Reason : " + reason },
              { text: "Description : " + description },
              { text: "Motif_refused : " + motifRefused }
            ],
            []
          ]
        },
        {
          columns: [
            [{ qr: "oumaima", fit: '45', alignment: 'right' }],
            [{ text: 'Signature', alignment: 'right', italics: true }]
          ]
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15]
        }
      }
    };

    pdfMake.createPdf(this.docDefinition).open();
  }
}
