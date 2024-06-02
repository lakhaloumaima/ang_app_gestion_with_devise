import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersServicesService } from 'src/app/services/users-services.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent  {
  user: any;

  constructor( private usersServicesService: UsersServicesService , private router: Router  ) {

    this.user = JSON.parse(sessionStorage.getItem('user')!);
    console.log(this.user.id)
    
  }

  logout(){
  
    this.usersServicesService.logout();
    console.log("log out" )
    sessionStorage.clear() 
    window.location.href =  'http://localhost:4200';
   
  }

}
