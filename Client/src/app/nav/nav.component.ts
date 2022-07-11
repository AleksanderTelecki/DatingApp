import { Component, OnInit } from '@angular/core';
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


  constructor(public accountsService:AccountsService) { }

  ngOnInit(): void {

  }

  login(){
    this.accountsService.login(this.model).subscribe({
      error: error => console.log(error)
    });
  }
  
  logout(){
    this.accountsService.logout();
  }

}
