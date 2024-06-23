import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersServicesService {

  private currentUserSubject: BehaviorSubject<any> | undefined;
  public currentUser: Observable<any> | undefined;

  constructor(private http: HttpClient, public router: Router) {

    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('user')!));
    this.currentUser = this.currentUserSubject.asObservable();
  }


  /************************************************ ADMIN + EMPLOYEE ***************************************************/
  login(data: any): Observable<any> {
    return this.http.post(environment.urlBackend + 'users/sign_in/', data);

  }

  resetPassword(token: any, email: any): Observable<any> {
    return this.http.put(environment.urlBackend + 'password_resets/' + token, email);
  }

  sendResetLink(email: any) {
    return this.http.post(environment.urlBackend + 'password_resets/', email);
  }


  updateimageuser(id: any, data: any): Observable<any> {
    return this.http.patch(environment.urlBackend + 'updateimguser/' + id, data);
  }

  updateinfouser(id: any, data: any): Observable<any> {
    return this.http.patch(environment.urlBackend + 'updateuser/' + id, data);
  }


  logout(): Observable<any> {
    return this.http.delete(environment.urlBackend + 'users/sign_out/')
  }


  /************************************************FOR ADMIN ******************************************************/

  registerAdmin(data: any): Observable<any> {
    return this.http.post(environment.urlBackend + 'users/', data)
  }

  registerEmployee(data: any): Observable<any> {
    return this.http.post(environment.urlBackend + 'createEmployee/', data)
  }

  getAllEmployees() {
    return this.http.get(environment.urlBackend + 'employees/')
  }

  getAllEmployeesByCompany(company_id: any) {
    return this.http.get(environment.urlBackend + 'getAllEmployeesByCompany/' + company_id )
  }


  getAllUsersByCompany(company_id: any) {
    return this.http.get(environment.urlBackend + 'getAllUsersByCompany/' + company_id )
  }

  getUserById(id: any) {
    return this.http.get(environment.urlBackend + 'getUserById/' + id )
  }

  // Fetch employees filtered by role
  getEmployeesByRole(role: any, company_id: any): Observable<any> {
    return this.http.get(environment.urlBackend + 'getUsersByRole/' + role + "/" + company_id );
  }

  getAllUsers() {
    return this.http.get(environment.urlBackend + 'users/')
  }

  updateEmployee(id: any, newprofile: any) {
    return this.http.patch(environment.urlBackend + 'updateuser/' + id, newprofile)
  }

  deleteEmployee(id: any) {
    return this.http.delete(environment.urlBackend + 'employees/' + id)
  }

  countAllForAdmin(company_id: any ): Observable<any> {
    return this.http.get(environment.urlBackend + 'countall/' + company_id )
  }

  getuser(id: any): Observable<any> {
    return this.http.get(environment.urlBackend + 'getuser/' + id)
  }

  searchEmployeeByEmail(id: any): Observable<any> {
    return this.http.get(environment.urlBackend + 'getEmployeeByEmail/' + id)
  }


  exportPdf(requestId: number, email: any ): Observable<Blob> {
    return this.http.get(`${environment.urlBackend}/request/${requestId}/export_certificate`, {
      responseType: 'blob'
    });
  }



}
