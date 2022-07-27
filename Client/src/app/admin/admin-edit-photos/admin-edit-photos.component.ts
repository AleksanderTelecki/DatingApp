import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { AccountsService } from 'src/app/_services/accounts.service';
import { AdminService } from 'src/app/_services/admin.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-edit-photos',
  templateUrl: './admin-edit-photos.component.html',
  styleUrls: ['./admin-edit-photos.component.css']
})
export class AdminEditPhotosComponent implements OnInit {

  @Input() member: Member;

  constructor(private adminService:AdminService, private memberService:MembersService) {}

  ngOnInit(): void {

  }


  deletePhoto(photo:Photo){
    this.adminService.deletePhoto(photo.id).subscribe({
      next: response => {
        this.member.photos = this.member.photos.filter(x => x.id !== photo.id);
        this.memberService.cleanMembers();
      }
    })
  }

  approvePhoto(photo:Photo){
    this.adminService.approvePhoto(photo.id,this.member.userName).subscribe({
      next: response => {
        const index = this.member.photos.indexOf(photo);
        this.member.photos[index].isApproved = true;
        if (this.member.photos.length == 1) {
          this.member.photos[index].isMain = true;
          this.member.photoUrl = this.member.photos[index].url;
        }
        console.log(this.member);
        this.memberService.cleanMembers();
      }
    })
  }

}
