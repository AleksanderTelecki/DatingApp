import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.css']
})
export class UserManagmentComponent implements OnInit {

  users:Partial<User[]>;
  bsModalRef:BsModalRef;
  constructor(private adminService:AdminService, private modalService:BsModalService) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles(){
    this.adminService.getUsersWithRoles().subscribe({
      next:users=>{
        this.users = users;
      }
    })
  }

  openRolesModal(user:User){
    const config = {
      class: 'model-dialog-centered',
      initialState:{
        user,
        roles:this.getRolesArray(user)

      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.content.updateSelectedRoles.subscribe(values=>{
      const rolesToUpdate = {
        roles:[...values.filter(el=>el.checked===true).map(el=>el.name)]
      };

      if (rolesToUpdate) {
        this.adminService.updateUserRoles(user.userName,rolesToUpdate.roles).subscribe({
          next:()=>{
            user.roles = [...rolesToUpdate.roles]
          }
        })
      }

    })
  }

  private getRolesArray(user){
    const roles = [];
    const userRoles = user.roles;
    const avalibleRoles:any[] = [
      {name:'Admin',value:'Admin'},
      {name:'Moderator',value:'Moderator'},
      {name:'Member',value:'Member'}
    ]

    avalibleRoles.forEach(r=>{
      let isMatch = false;
      for(const userRole of userRoles){
        if (r.name === userRole) {
          isMatch = true;
          r.checked = true;
          roles.push(r);
          break;
        }
      }
      if(!isMatch){
        r.checked = false;
        roles.push(r);
      }
    })

    return roles;

  }

}
