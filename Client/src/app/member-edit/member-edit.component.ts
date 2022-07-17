import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { first, take } from 'rxjs/operators';
import { Member } from '../_models/member';
import { User } from '../_models/user';
import { AccountsService } from '../_services/accounts.service';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm:NgForm;
  member:Member;
  user:User;
  constructor(private accountsService: AccountsService, private membersService:MembersService,private toastr:ToastrService) {
    this.accountsService.currentUser$.pipe(first()).subscribe({
      next: user=>this.user=user
    });
  }

  ngOnInit(): void {
    this.getMember();
  }

  getMember(){
    this.membersService.getMember(this.user.userName).subscribe({
      next: member=>this.member=member
    });    
  }

  updateMember(){
    this.membersService.updateMember(this.member).subscribe({
      next:response=>{
        this.toastr.success("Profile updated successfully");
        this.editForm.reset(this.member);
      }
    });
  }



}
