import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent implements OnInit {

  baseUrl = environment.ApiUrl;
  validationErrors: string[] = []

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  get404Error(){
    this.http.get(this.baseUrl+'buggy/not-found').subscribe({
      next(response) {
        console.log(response)
      },
      error(err) {
        console.log(err)
      },
    })
  }

  get400Error(){
    this.http.get(this.baseUrl+'buggy/bad-request').subscribe({
      next(response) {
        console.log(response)
      },
      error(err) {
        console.log(err)
      },
    })
  }

  get500Error(){
    this.http.get(this.baseUrl+'buggy/server-error').subscribe({
      next(response) {
        console.log(response)
      },
      error(err) {
        console.log(err)
      },
    })
  }

  get401Error(){
    this.http.get(this.baseUrl+'buggy/auth').subscribe({
      next(response) {
        console.log(response)
      },
      error(err) {
        console.log(err)
      },
    })
  }

  get400ValidationError(){
    this.http.post(this.baseUrl+'account/register',{}).subscribe({
      next(response) {
        console.log(response);
      },
      error(err) {
        console.log(err);
      },
    })
  }

}
