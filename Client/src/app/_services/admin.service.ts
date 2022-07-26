import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl = environment.ApiUrl;
  constructor(private http:HttpClient) { }

  getUsersWithRoles(){
    return this.http.get<Partial<User[]>>(this.baseUrl+"admin/users-with-roles");
  }

  getUsersWithMainPhoto(){
    return this.http.get<Partial<User[]>>(this.baseUrl+"admin/users-to-moderate");
  }

  getUserWithPhotos(username:string){
    return this.http.get<Member>(this.baseUrl+"admin/users-to-moderate/"+username);
  }

  updateUserRoles(username:string,roles:string[]){
    return this.http.post(this.baseUrl+`admin/edit-roles/${username}?roles=${roles.join(',')}`,{})
  }

  updateMember(member:Member){
    return this.http.put(this.baseUrl+'admin',member);
  }

  deleteMember(member:Member){
    return this.http.delete(this.baseUrl+'admin/users-to-moderate/'+member.userName);
  }
}
