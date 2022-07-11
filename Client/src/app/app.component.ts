import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountsService } from './_services/accounts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The Dating App';
  users:any;

  constructor(private http:HttpClient,private accounsService:AccountsService){

  }

  ngOnInit(){
    this.setCurrentUser();

  }

  setCurrentUser(){
    const user:User = JSON.parse(localStorage.getItem('user'));
    this.accounsService.setCurrentUser(user);
  }

}
