import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandesServicesService {

  constructor(private http: HttpClient, public router: Router) {

  }

  /************************************************REASON ******************************************************/

  addReason(data: any): Observable<any> {
    return this.http.post(environment.urlBackend + 'addReason/', data)
  }

  getAllReasons(): Observable<any> {
    return this.http.get(environment.urlBackend + 'reason/')
  }

  deleteReason(id: any): Observable<any> {
    return this.http.delete(environment.urlBackend + 'reasons/' + id)
  }

  /************************************************FOR EMPLOYEE ******************************************************/

  addRequest(data: any): Observable<any> {
    return this.http.post(environment.urlBackend + 'addRequest/', data)
  }

  getRequestsByID(user_id: any): Observable<any> {
    return this.http.get(environment.urlBackend + 'getrequestsbyid/' + user_id)
  }

  updateRequestByEmployee(id: any, data: any): Observable<any> {
    return this.http.patch(environment.urlBackend + 'updateRequestByEmployee/' + id, data)
  }

  getrequestdata(id: any): Observable<any> {
    return this.http.get(environment.urlBackend + 'getrequestdata/' + id)
  }

  getRequestsByIDAccepted(user_id: any): Observable<any> {
    return this.http.get(environment.urlBackend + 'getRequestsByIdAccepted/' + user_id)
  }

  /************************************************FOR ADMIN ******************************************************/

  getAllRequests(company_id: any): Observable<any> {
    return this.http.get(environment.urlBackend + 'requests/' + company_id )
  }

  getAllRequestsByCompany(company_id: any ): Observable<any> {
    return this.http.get(environment.urlBackend + 'getAllRequestsByCompany/' + company_id )
  }

  updateRequest(id: any, data: any): Observable<any> {
    return this.http.patch(environment.urlBackend + 'requests/' + id, data)
  }

  getrequestinprogressbyemployee(company_id: any): Observable<any> {
    return this.http.get(environment.urlBackend + 'getrequestinprogressbyemployee/' + company_id )
  }

  getrequestacceptedbyemployee(company_id: any): Observable<any> {
    return this.http.get(environment.urlBackend + 'getrequestacceptedbyemployee/' + company_id)
  }

  getrequestrefusedbyemployee(company_id: any): Observable<any> {
    return this.http.get(environment.urlBackend + 'getrequestrefusedbyemployee/' + company_id)
  }

  /************************************************FOR ADMIN AND EMPLOYEE ******************************************/

  deleteRequest(id: any): Observable<any> {
    return this.http.delete(environment.urlBackend + 'requests/' + id)
  }

  // exportPdf(id: number): Observable<Blob> {
  //   return this.http.get(environment.urlBackend + 'requests/' + id + '/export_pdf', { responseType: 'blob' });
  // }

  // importPdf(id: number, file: File): Observable<any> {
  //   const formData: FormData = new FormData();
  //   formData.append('file', file, file.name);

  //   return this.http.post(environment.urlBackend + 'requests/' + id + '/import_pdf', formData);
  // }

  // exportPdf(id: number): Observable<Blob> {
  //   return this.http.get(`${environment.urlBackend}request/${id}/export_pdf`, { responseType: 'blob' });
  // }

  importPdf(id: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('certificate', file, file.name); // Ensure the key matches the controller's expected parameter
    return this.http.post(`${environment.urlBackend}request/${id}/import_pdf`, formData);
  }


  exportPdf(requestId: number, email: any ): Observable<Blob> {
    return this.http.get(`${environment.urlBackend}/request/${requestId}/export_certificate`, {
      responseType: 'blob'
    });
  }

}
