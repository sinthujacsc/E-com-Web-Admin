import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import * as Bowser from "bowser";



@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent {
	ipAddress: any;
	systemToken: any = {};
	browsername: any;

	constructor(private router: Router, private http: HttpClient, private toastr: ToastrService, private service: AuthService, private cookieService: CookieService) { }

	formModel = {
		email: '',
		password: ''
	};

	ngOnInit() {
		// if (this.cookieService.get('token') != null) {
		// 	this.router.navigateByUrl('/dashboard');
		//   }
		this.getIpAddress();
	}

	onSubmit(form: NgForm) {
		this.service.systemLogin(form.value).subscribe(
			(res: any) => {
				console.log(res);

				var domain = window.location.hostname;
				this.cookieService.set("token", res.access_token, 1, undefined, domain, true);
				this.cookieService.set("user_id", res.user.code, 1, undefined, domain, true);
				this.saveSystemToken(res.access_token, res.user.code);
				this.router.navigateByUrl('/dashboard');
				this.toastr.success('Login Successfull.', '');
			},
			err => {
				this.toastr.error('Incorrect userName or password.', '');
			}
		);
	}
	getIpAddress() {
		this.http.get<{ ip: string }>('https://jsonip.com')
			.subscribe(data => {
				console.log('th data', data);
				this.ipAddress = data.ip;
			})
	}

	saveSystemToken(tokenNo: any, userId: any) {
		var userAgent = Bowser.parse(window.navigator.userAgent);
		var browser = Bowser.getParser(window.navigator.userAgent);
		this.browsername = JSON.stringify(browser.getBrowser(), null, 4);

		this.systemToken.token_number = tokenNo;
		this.systemToken.user_id = userId;
		this.systemToken.ip_address = this.ipAddress;
		this.systemToken.browser = JSON.parse(this.browsername).name;

		console.log(this.systemToken);
		this.service.Post('check-token-availability', this.systemToken).subscribe(
			() => {

			},
			err => {
				console.log(err);
				this.toastr.error('Error while fetching data!', 'Error');
			}
		);
	}
}
