import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/auth.service';
import * as Bowser from "bowser";


@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {
  userName: any;
  systemToken: any = {};
  browsername: any;


  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(private classToggler: ClassToggleService, private router: Router, private service: AuthService, private toastr: ToastrService, private cookieService:CookieService) {
    super();
  }

  
	ngOnInit() {
		this.getUserProfile();
	}
  getUserProfile(){
		this.service.getUserProfile().subscribe(
			(data: any) => {
				this.userName = data.name;
			},
			err => {
				// this.toastr.error('Error while getting data', '');
				this.onLogout();
			  }
		);
	}
  onLogout() {
		this.service.systemLogout().subscribe(
			(data: any) => {
				this.deleteSystemToken();
			
				
				setTimeout(() => {
					this.cookieService.deleteAll();
					this.router.navigate(['/auth']);
				}, 200);
				this.toastr.success('Successfully logged out...', '');

			},
			err => {
				this.toastr.error('Error while getting data', '');
			}
		);
	}
	deleteSystemToken(){
		var userAgent = Bowser.parse(window.navigator.userAgent);
		var browser = Bowser.getParser(window.navigator.userAgent);
		this.browsername = JSON.stringify(browser.getBrowser(), null, 4);

		this.systemToken.user_id = this.cookieService.get('user_id');
		this.systemToken.browser = JSON.parse(this.browsername).name;

		console.log(this.systemToken);
		this.service.Post('delete-system-token', this.systemToken).subscribe(
			() => {

			},
			err => {
				this.toastr.error('Error while fetching data!', 'Error');
			}
		);
	}
}
