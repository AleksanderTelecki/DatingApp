import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountsService } from '../_services/accounts.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model:any = {}


  constructor(public accountsService:AccountsService, private router:Router, private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  login(){
    this.accountsService.login(this.model).subscribe({
      next: response=>{
        this.router.navigateByUrl('/members');
      },
      error: error => {
        console.log(error);
        this.toastr.error(error.error);
      }
    });
  }
  
  logout(){
    this.accountsService.logout();
    this.router.navigateByUrl('/');
  }

}
