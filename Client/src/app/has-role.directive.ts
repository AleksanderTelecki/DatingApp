import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from './_models/user';
import { AccountsService } from './_services/accounts.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit{
  @Input() appHasRole:string[];
  user:User;

  constructor(private viewContainerRef:ViewContainerRef, private templeteRef:TemplateRef<any>, private accountService:AccountsService) {
    this.accountService.currentUser$.pipe(first()).subscribe({
      next: user=>{
        this.user = user;
      }
    })
   }

  ngOnInit(): void {
    if (this.user?.roles || this.user.roles===null) {
      this.viewContainerRef.clear();
    }

    if (this.user.roles.some(r=>this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templeteRef);
    }else{
      this.viewContainerRef.clear();
    }
  }

}
