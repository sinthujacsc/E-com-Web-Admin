import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import * as Bowser from "bowser";
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  httpHeaders: any;
  systemToken: any = {};
  browsername: any;


  constructor(private http: HttpClient, private router: Router,private toastr: ToastrService, private fb: FormBuilder, private cookieService: CookieService) { 
    this.ValidateSystemToken();

  }

  systemLogin(formData:any) {
    return this.http.post(environment.utilityApiBasePath + 'login', formData);
  }

  getUserProfile() {
    const tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + this.cookieService.get('token') });
    return this.http.get(environment.utilityApiBasePath + 'profile', { headers: tokenHeader });
  }

  systemLogout() {
    const tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + this.cookieService.get('token') });
    return this.http.get(environment.utilityApiBasePath + 'logout', { headers: tokenHeader });
  }

  Get(route: any): Observable<any[]> {
    return this.http.get<any[]>(environment.utilityApiBasePath + route);
  }

  GetById(route: any, id: any): Observable<any[]> {
    return this.http.get<any[]>(environment.utilityApiBasePath + route + '/' + id);
  }

  GetByTwoId(route: any, param1: any, param2: any): Observable<any[]> {
    return this.http.get<any[]>(environment.utilityApiBasePath + route + '/' + param1 + '/' + param2);
  }

  Post(route: any, data: any): Observable<any> {
    const httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json');
    const options = {
      headers: httpHeaders
    };
    return this.http.post<any>(environment.utilityApiBasePath + route, data, options);
  }

  Update(route: any, data: any, id: any): Observable<number> {
    const httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json');
    const options = {
      headers: httpHeaders
    };
    return this.http.patch<number>(environment.utilityApiBasePath + route + '/' + id, data, options);
  }

  Delete(route: any, id: number): Observable<number> {
    const httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.delete<number>(environment.utilityApiBasePath + route + '/' + id);
  }

  ValidateSystemToken(){
    var userAgent = Bowser.parse(window.navigator.userAgent);
		var browser = Bowser.getParser(window.navigator.userAgent);
		this.browsername = JSON.stringify(browser.getBrowser(), null, 4);

		this.systemToken.user_id = this.cookieService.get('user_id');
		this.systemToken.browser = JSON.parse(this.browsername).name;
    this.Post('validate-system-token', this.systemToken).subscribe(
			(data:any) => {
        console.log(data.status);
        if(data.status==false){
          this.router.navigate(['/login']);

        }

			},
			err => {
				console.log(err);
				this.toastr.error('Error while fetching data!', 'Error');
			}
		);
  }
}
