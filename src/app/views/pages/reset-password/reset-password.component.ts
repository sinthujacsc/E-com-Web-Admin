import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';
import * as Bowser from "bowser";
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: any;
  resetpassword: any = {};
  dataSaved = false;
  timeout: any;
  userCode:any="";
  systemToken: any = {};
  browsername: any;

  
  strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
  mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))');

  constructor(private http: HttpClient,public formBuilder: FormBuilder,private cookieService:CookieService,private route: ActivatedRoute,  private toastr: ToastrService, private router: Router) { }


  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],

    });
    this.resetPasswordForm.get('password_confirmation').valueChanges.subscribe((event: any) => {
      this.validateUser(this.resetPasswordForm);
    });
    var strengthBadge = document.getElementById('StrengthDisp') as HTMLInputElement;
    this.resetPasswordForm.get('password').valueChanges.subscribe((event:any)=>{
      strengthBadge.style.display = 'block';
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.StrengthChecker(this.resetPasswordForm.get('password').value), 500);
      if(this.resetPasswordForm.get('password').value.length !== 0) {
          strengthBadge.style.display != 'block';
      } else {
          strengthBadge.style.display = 'none';
      }
    });

    this.route.params.subscribe(data => {
      this.userCode = data['code'];
      console.log(data);
    });
  }
  StrengthChecker(PasswordParameter: any) {
    var strengthBadge = document.getElementById('StrengthDisp') as HTMLInputElement;
    if (this.strongPassword.test(PasswordParameter)) {
      strengthBadge.style.backgroundColor = "green";
      strengthBadge.textContent = 'Strong';
    } else if (this.mediumPassword.test(PasswordParameter)) {
      strengthBadge.style.backgroundColor = '#eed202';
      strengthBadge.textContent = 'Medium';
    } else {
      strengthBadge.style.backgroundColor = 'red';
      strengthBadge.textContent = 'Weak';
    }
  }

  validateUser(fb: FormGroup) {
    var pass = this.resetPasswordForm.get('password').value;
    var c_pass = this.resetPasswordForm.get('password_confirmation').value;
    let password = fb.get('password_confirmation');
    if (pass === c_pass) {
      password?.setErrors(null);
    } else {
      password?.setErrors({ unmatch: true });
    }
  }

  passwordReset(){
      this.resetpassword.password = this.resetPasswordForm.get('password').value;
      this.resetpassword.password_confirmation = this.resetPasswordForm.get('password_confirmation').value;
      this.resetpassword.code=this.userCode;

      this.http.post(environment.utilityApiBasePath+'reset-password',this.resetpassword).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('Password successfully updated!', 'Ok!');
          this.deleteSystemToken();
          this.router.navigate(['/login']);
        },
        err => {
          console.log(err);
          this.toastr.error('Error while fetching data!', 'Error');
        }
      );
  }
  deleteSystemToken(){

		this.systemToken.user_id =this.userCode;

		console.log(this.systemToken);
		this.http.post(environment.utilityApiBasePath+'token-delete-by-userid', this.systemToken).subscribe(
			() => {

			},
			err => {
				console.log(err);
				this.toastr.error('Error while fetching data!', 'Error');
			}
		);
	}
}
