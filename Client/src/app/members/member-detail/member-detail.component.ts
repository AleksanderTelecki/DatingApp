import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { first } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountsService } from 'src/app/_services/accounts.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  
  @ViewChild('memberTabs',{static:true}) memberTabs:TabsetComponent;
  activeTab:TabDirective;
  member:Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  messages:Message[]=[];
  user:User;

  constructor(public presenceService:PresenceService,private route:ActivatedRoute,
    private messageService:MessageService,private accountsService:AccountsService, private router:Router) {
    this.accountsService.currentUser$.pipe(first()).subscribe({
      next: user=>{
        this.user = user;
      }
    })
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next:data=>{
        this.member = data.member;
      }
    })

    this.route.queryParams.subscribe({
      next: params=>{
        params.tab ? this.selectTab(params.tab):this.selectTab(0);
      }
    })

    this.galleryOptions = [
      {
        width:'500px',
        height:'500px',
        imagePercent:100,
        thumbnailsColumns:4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview:false

      }
    ]

    this.galleryImages = this.getImages();

    
  }

  getImages():NgxGalleryImage[]{
    const imageUrls = []
    for(const photo of this.member.photos){
      imageUrls.push({
        small:photo?.url,
        medium:photo?.url,
        big:photo?.url
      })
      console.log(photo);
    }
    return imageUrls;
  }

  loadMessages(){
    this.messageService.getMessageThread(this.member.userName).subscribe({
      next:response=>{
        this.messages = response;
      }
    });
  }

  selectTab(tabId:number){
    this.memberTabs.tabs[tabId].active = true;
  }

  onTabActivated(data:TabDirective){
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.messageService.createHubConnection(this.user,this.member.userName);
    }else{
      this.messageService.stopHubConnection();
    }
  }


}
