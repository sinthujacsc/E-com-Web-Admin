import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  addUserForm: any;
  user: any = {};
  dataSaved = false;


  file_store_subCategory!: FileList;
  user_image: any;

  user_profile: FormControl = new FormControl("");
  percentage: string = '0%';

  serverImgPath = environment.img_path + 'user/';
  userImageSrc: any = "./assets/images/noImage.jpg";

  allUser: any;
  isChecked: string = 'Y';
  checked: boolean = true;
  userIdToUpdate = null;

  p: number = 1;
  searchText:any;
  loadImage:boolean=false;
	isView: boolean = false;
  isView1: boolean = false;
  initialConfirmPasswordValue:any;

  constructor(public formBuilder: FormBuilder, private toastr: ToastrService,
    private message: ConfirmationDialogService, private http: HttpClient, private service: AuthService) {

  }

  ngOnInit(): void {
    this.addUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      isActive: [''],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],

    });
    this.addUserForm.get('password_confirmation').valueChanges.subscribe((event: any) => {
      this.validateUser(this.addUserForm);
    });
    this.loadAllUser();
    

  }
  isViewed()
	{
		this.isView = !this.isView;
    const confirmPasswordControl = this.addUserForm.get('password_confirmation');
    if (confirmPasswordControl) {
        confirmPasswordControl.setValue('');
    }
	}
  isViewed1()
	{
		this.isView1 = !this.isView1;

	}

  querySearch() {
    this.searchText=this.searchText?this.searchText:null;
    if(this.searchText != null){
    this.service.GetById('filter-activity',this.searchText).subscribe(
      (success: any) => {
        this.allUser= success;
        this.p = 1; // Reset pagination to the first page
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');
      });
    }else{
      this.loadAllUser();
    }
  }

  validateUser(fb: FormGroup) {
    var pass = this.addUserForm.get('password').value;
    var c_pass = this.addUserForm.get('password_confirmation').value;
    let password = fb.get('password_confirmation');
    if (pass === c_pass) {
      password?.setErrors(null);
    } else {
      password?.setErrors({ unmatch: true });
    }
  }
  onSubmit() {
    this.dataSaved = false;
    this.saveOrUpdate();
    this.addUserForm.reset();
  }
  checkValue(e: any) {
    if (e.target.checked === true) {
      this.isChecked = 'Y';
      this.checked = true;
    } else {
      this.isChecked = 'N';
      this.checked = false;
    }
  }

  handleImage(l: FileList, event: any): void {
    this.file_store_subCategory = l;
    if (l.length) {
      const f = l[0];
      const count = l.length > 1 ? `(+${l.length - 1} files)` : "";
      this.user_profile.patchValue(`${f.name}${count}`);
      this.user_image = event.target.files[0];
    } else {
      this.user_profile.patchValue("");
    }

    const reader = new FileReader();
    reader.onload = e => {
      this.userImageSrc = reader.result;
    };

    reader.readAsDataURL(this.user_image);

    const myFormData_cv = new FormData();
    const headers_cv = new HttpHeaders();
    headers_cv.append('Content- Type', 'multipart/form-data');
    headers_cv.append('Accept', 'application/json');
    myFormData_cv.append('imgPath', this.user_image);
    myFormData_cv.append('code', this.user_image.name);

    this.http.post(environment.utilityApiBasePath + 'upload-user', myFormData_cv, {
      headers: headers_cv, reportProgress: true,
      observe: 'events'
    }).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.percentage = Math.round(100 * event.loaded / event.total) + '%';
      } else if (event instanceof HttpResponse) {
        console.log('File uploaded successfully!' + JSON.stringify(event));
        this.loadImage=true;

        this.user_image = null;
        this.percentage = Math.round(100 * 0) + '%';
      }

    }, error => {


      this.toastr.error('Error while fetching data!', 'Error.');

    });

  }
  removeImage1(){
    this.loadImage=false;
    this.user_profile.patchValue("");
    this.userImageSrc = "./assets/images/noImage.jpg";

  }

  saveOrUpdate() {

    this.user.name = this.addUserForm.get('name').value;
    this.user.email = this.addUserForm.get('email').value;
    this.user.password = this.addUserForm.get('password').value;
    this.user.password_confirmation = this.addUserForm.get('password_confirmation').value;
    this.user.isActive = this.isChecked;
    this.user.imagePath = this.user_profile.value ? this.user_profile.value : '-';

    console.log(this.user);
    if (this.userIdToUpdate == null) {
      this.service.Post('register', this.user).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('New user Created!', 'OK!');
          this.loadAllUser();
          this.userIdToUpdate = null;
          this.clearLocal();
        },
        err => {
          console.log(err);
          this.toastr.error('Error while fetching data!', 'Error.');
        }
      );
      // } else {
      //   this.user.id = this.subCategoryIdToUpdate;
      //   this.subCategory.nameOf = this.subCategoryForm.get('nameOf').value;
      //   this.subCategory.isActive = this.isChecked;
      //   this.subCategory.imgPath = this.subCategory_profile.value ? this.subCategory_profile.value : '-';

      //   this.service.Update('sub-category', this.subCategory, this.subCategoryIdToUpdate).subscribe(
      //     () => {
      //       this.dataSaved = true;
      //       // success
      //       this.toastr.success('sub Category Info Updated!', 'Ok!');
      //       this.loadAllsubCategory();
      //       this.subCategoryIdToUpdate = null;
      //       this.clearLocal();
      //     },
      //   err => {
      //     this.toastr.error('Error while fetching data!', 'Error');
      //   }
      // );
    }
  }
  clearLocal() {
    this.user_profile.patchValue(null);
    this.addUserForm.reset();
    this.isChecked = 'Y';
    this.checked = true;
    this.userImageSrc = "./assets/images/noImage.jpg";

  }
  loadAllUser() {
    this.service.Get('user').subscribe(
      (success: any) => {
        this.allUser = success.data;
        console.log(this.allUser);
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }
  onDelete(id: any) {
    const confirmed = window.confirm('Are you sure you want to delete this customer enquiry?');
    if(confirmed){
    this.service.Delete('user', id).subscribe(
      () => {
        // success

        this.toastr.success('User Deleted!', 'Ok!');
        this.loadAllUser();
        this.userIdToUpdate = null;
        this.clearLocal();
      },
      err => {
        this.toastr.error('Error while fetching data!', 'Eroor');
      }
    );
  }
}
removeImage(){
  this.userImageSrc="./assets/images/noImage.jpg";

}
}
