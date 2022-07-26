import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from '../_models/member';
import { AdminService } from '../_services/admin.service';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-admin-member-edit',
  templateUrl: './admin-member-edit.component.html',
  styleUrls: ['./admin-member-edit.component.css']
})
export class AdminMemberEditComponent implements OnInit {

  @ViewChild('editForm') editForm:NgForm;
  member:Member;
 
  constructor(private route: ActivatedRoute,private router:Router, private adminService:AdminService, 
    private toastr:ToastrService, private memberService:MembersService) { }

  ngOnInit(): void {
    this.loadMember()
  }

  loadMember(){
    const routeParams = this.route.snapshot.paramMap;
    const username = routeParams.get('username');
    this.adminService.getUserWithPhotos(username).subscribe({
      next:response=>{
        this.member = response
        console.log(response);
      }
    });
  }

  updateMember(){
    this.adminService.updateMember(this.member).subscribe({
      next:response=>{
        this.toastr.success("Profile updated successfully");
        this.editForm.reset(this.member);
        this.memberService.cleanMembers();
      }
    });
  }

  deleteMember(){
    this.adminService.deleteMember(this.member).subscribe({
      next:()=>{
        this.toastr.success("Member Deleted");
        this.memberService.cleanMembers();
        this.router.navigateByUrl('/admin');
      }
    })

  }

}
