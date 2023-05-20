import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  addCompanyForm: any;
  allCompany: any;
  company: any = {};
  allcompany: any;
  isChecked: string = 'Y';
  checked: boolean = true;

  file_store_company!: FileList;
  company_image: any;

  company_profile: FormControl = new FormControl("");
  percentage: string = '0%';

  dataSaved = false;
  companyIdToUpdate = null;
  searchTerm: any = { nameOf: '' };
  p: number = 1;
  serverImgPath = environment.img_path;
  companyImageSrc: any = "./assets/images/noImage.jpg";
  

  constructor(public formBuilder: FormBuilder, private toastr: ToastrService,
    private message: ConfirmationDialogService, private http: HttpClient, private service: AuthService, private router: Router, private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.addCompanyForm = this.formBuilder.group({
      nameOf: ['', [Validators.required]],
      isActive: [''],
      add1: ['', [Validators.required]],
      add2: [''],
      city: ['', [Validators.required]],
      state: [''],
      message: [''],
      tel1: ['', [Validators.required]],
      tel2: [''],
      tel3: [''],
      email: [''],
      zipcode:['']

    });
   
    this.loadAllCompany();
   
  }

 

  handleImage(l: FileList, event: any): void {
    this.file_store_company = l;
    if (l.length) {
      const f = l[0];
      const count = l.length > 1 ? `(+${l.length - 1} files)` : "";
      this.company_profile.patchValue(`${f.name}${count}`);
      this.company_image = event.target.files[0];
    } else {
      this.company_profile.patchValue("");
    }

    const reader = new FileReader();
    reader.onload = e => {
      this.companyImageSrc = reader.result;
    };

    reader.readAsDataURL(this.company_image);

    const myFormData_cv = new FormData();
    const headers_cv = new HttpHeaders();
    headers_cv.append('Content- Type', 'multipart/form-data');
    headers_cv.append('Accept', 'application/json');
    myFormData_cv.append('logo', this.company_image);
    myFormData_cv.append('code', this.company_image.name);

    this.http.post(environment.utilityApiBasePath + 'upload-logo', myFormData_cv, {
      headers: headers_cv, reportProgress: true,
      observe: 'events'
    }).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.percentage = Math.round(100 * event.loaded / event.total) + '%';
      } else if (event instanceof HttpResponse) {
        console.log('Logo uploaded successfully!' + JSON.stringify(event));

        this.company_image = null;
        this.percentage = Math.round(100 * 0) + '%';
      }

    }, error => {


      this.toastr.error('Error while fetching data!', 'Error.');

    });

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
 

  onSubmit() {
    this.dataSaved = false;
    this.saveOrUpdate();
    this.addCompanyForm.reset();
  }

  loadAllCompany() {
    this.service.Get('company').subscribe(
      (item: any) => {
        this.allCompany = item.data[0];
        console.log(item);
        this.companyIdToUpdate = this.allCompany.custId;
        this.addCompanyForm.controls['nameOf'].setValue(this.allCompany.nameOf);
        this.addCompanyForm.controls['message'].setValue(this.allCompany.message);
        this.addCompanyForm.controls['isActive'].setValue(this.allCompany.isActive);
        this.addCompanyForm.controls['state'].setValue(this.allCompany.state);
        this.addCompanyForm.controls['city'].setValue(this.allCompany.city);
        this.addCompanyForm.controls['zipcode'].setValue(this.allCompany.zipcode);
        this.addCompanyForm.controls['add1'].setValue(this.allCompany.add1);
        this.addCompanyForm.controls['add2'].setValue(this.allCompany.add2);
        this.addCompanyForm.controls['tel1'].setValue(this.allCompany.tel1);
        this.addCompanyForm.controls['tel2'].setValue(this.allCompany.tel2);
        this.addCompanyForm.controls['tel3'].setValue(this.allCompany.tel3);
        this.company_profile.patchValue(this.allCompany.logo);
        this.companyImageSrc=environment.img_path+'company/'+this.allCompany.logo;

        this.addCompanyForm.controls['email'].setValue(this.allCompany.email);

      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }
  

  saveOrUpdate() {

    this.company.nameOf = this.addCompanyForm.get('nameOf').value;
    this.company.isActive = this.isChecked;
    this.company.message = this.addCompanyForm.get('message').value;
    this.company.state = this.addCompanyForm.get('state').value;
    this.company.city = this.addCompanyForm.get('city').value;
    this.company.zipcode = this.addCompanyForm.get('zipcode').value;
    this.company.add1 = this.addCompanyForm.get('add1').value;
    this.company.add2 = this.addCompanyForm.get('add2').value;
    this.company.tel1 = this.addCompanyForm.get('tel1').value;
    this.company.tel2 = this.addCompanyForm.get('tel2').value;
    this.company.tel3 = this.addCompanyForm.get('tel3').value;
    this.company.email = this.addCompanyForm.get('email').value;   
    this.company.logo = this.company_profile.value ? this.company_profile.value : '-';

    if (this.companyIdToUpdate == null) {
      this.service.Post('company', this.company).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('New Company Created!', 'OK!');
          this.loadAllCompany();
          this.companyIdToUpdate = null;
          this.clearLocal();
        },
        err => {

          this.toastr.error('Error while fetching data!', 'Error.');
        }
      );
    } else {
      this.company.custId = this.companyIdToUpdate;
      this.company.nameOf = this.addCompanyForm.get('nameOf').value;
      this.company.isActive = this.isChecked;
      this.company.message = this.addCompanyForm.get('message').value;
      this.company.state = this.addCompanyForm.get('state').value;
      this.company.city = this.addCompanyForm.get('city').value;
      this.company.zipcode = this.addCompanyForm.get('zipcode').value;
      this.company.add1 = this.addCompanyForm.get('add1').value;
      this.company.add2 = this.addCompanyForm.get('add2').value;
      this.company.tel1 = this.addCompanyForm.get('tel1').value;
      this.company.tel2 = this.addCompanyForm.get('tel2').value;
      this.company.tel3 = this.addCompanyForm.get('tel3').value;
      this.company.email = this.addCompanyForm.get('email').value; 
      this.company.logo = this.company_profile.value ? this.company_profile.value : '-';


      this.service.Update('company', this.company, this.companyIdToUpdate).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('Company Info Updated!', 'Ok!');
          this.loadAllCompany();
          this.companyIdToUpdate = null;
          this.clearLocal();
        },
        err => {
          this.toastr.error('Error while fetching data!', 'Error');
        }
      );
    }
  }

  clearLocal() {
    this.company_profile.patchValue(null);
    this.addCompanyForm.reset();
    this.isChecked = 'Y';
    this.checked = true;
    this.companyImageSrc = "./assets/images/noImage.jpg";
  }
}
