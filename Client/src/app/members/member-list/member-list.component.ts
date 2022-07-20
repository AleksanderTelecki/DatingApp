import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  members:Member[];
  pagination:Pagination;
  userParams:UserParams;
  genderList = [{value:'male',display:'Males'},{value:'female',display:'Females'}]

  constructor(private membersService:MembersService) {
    this.userParams = this.membersService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(){
    this.membersService.setUserParams(this.userParams);
    this.membersService.getMembers(this.userParams).subscribe({
      next: response=>{
        this.members = response.result;
        this.pagination = response.pagination; 
      }
    })
  }

  pageChanged(event:any){
    this.userParams.pageNumber = event.page;
    this.loadMembers();
  }

  resetFilters(){
    this.userParams = this.membersService.resetUserParams();
    this.loadMembers();
  }



}
