import { Component, OnInit } from '@angular/core';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { MembersService } from 'src/app/_services/members.service';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-photo-managment',
  templateUrl: './photo-managment.component.html',
  styleUrls: ['./photo-managment.component.css']
})
export class PhotoManagmentComponent implements OnInit {

  users:Partial<User[]>;


  constructor(private adminService:AdminService) {

  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(){
    this.adminService.getUsersWithMainPhoto().subscribe({
      next: users=>{
        this.users = users;
      }
    });
  }

  


  

}
