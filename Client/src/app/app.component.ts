import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountsService } from './_services/accounts.service';
import { PresenceService } from './_services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The Dating App';
  users:any;

  constructor(private http:HttpClient,private accounsService:AccountsService, private presence:PresenceService){

  }

  ngOnInit(){
    this.setCurrentUser();

  }

  setCurrentUser(){
    const user:User = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.accounsService.setCurrentUser(user);
      this.presence.createHubConnection(user);
    }
    
  }

}
