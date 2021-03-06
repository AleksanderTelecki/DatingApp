import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountsService } from '../_services/accounts.service';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model:any = {}


  constructor(public accountsService:AccountsService, private router:Router, private toastr: ToastrService,
    private memberService:MembersService) { }

  ngOnInit(): void {

  }

  login(){
    this.accountsService.login(this.model).subscribe({
      next: response=>{
        this.memberService.createUserParams();
        this.router.navigateByUrl('/members');
      }
    });
  }
  
  logout(){
    this.memberService.cleanMembers();
    this.accountsService.logout();
    this.router.navigateByUrl('/');
  }

}
