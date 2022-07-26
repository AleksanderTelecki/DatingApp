import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { AccountsService } from 'src/app/_services/accounts.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-edit-photos',
  templateUrl: './admin-edit-photos.component.html',
  styleUrls: ['./admin-edit-photos.component.css']
})
export class AdminEditPhotosComponent implements OnInit {

  @Input() member: Member;

  constructor(private accountService:AccountsService, private memberService:MembersService) {}

  ngOnInit(): void {

  }


  deletePhoto(photo:Photo){
    this.memberService.deletePhoto(photo.id).subscribe({
      next: response => {
        this.member.photos = this.member.photos.filter(x => x.id !== photo.id);
      }
    })
  }

}
