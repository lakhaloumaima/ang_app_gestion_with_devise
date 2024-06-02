import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersServicesService } from 'src/app/services/users-services.service';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.css']
})
export class SidebarAdminComponent  {
  user: any;

  constructor( private usersServicesService: UsersServicesService , private router: Router  ) { 
    this.user = JSON.parse(sessionStorage.getItem('user')!);
    console.log(this.user)
    
  }

  logout(){
  
    this.usersServicesService.logout();
    sessionStorage.clear() 
    window.location.href =  'http://localhost:4200';
   
  }


}
