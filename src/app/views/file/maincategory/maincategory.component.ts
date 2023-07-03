import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-maincategory',
  templateUrl: './maincategory.component.html',
  styleUrls: ['./maincategory.component.scss']
})
export class MaincategoryComponent implements OnInit {

  mainCategory: any = {};
  mainCategoryForm: any;
  allMainCategory: any;
  isChecked: string = 'Y';
  checked: boolean = true;
  loadedImage:boolean=false;

  file_store_mainCategory!: FileList;
  mainCategory_image: any;

  mainCategory_profile: FormControl = new FormControl("");
  percentage: string = '0%';

  dataSaved = false;
  mainCategoryIdToUpdate = null;
  searchTerm: any = { nameOf: '' };
  p: number = 1;
  searchText:any='';
  serverImgPath = environment.img_path+'mainCategory/';
  mainCategoryImageSrc:any="./assets/images/noImage.jpg";

  constructor(public formBuilder: FormBuilder, private toastr: ToastrService,
    private message: ConfirmationDialogService, private http: HttpClient, private service: AuthService

  ) { }

  ngOnInit(): void {

    this.mainCategoryForm = this.formBuilder.group({
      nameOf: ['', [Validators.required]],
      icon: ['', [Validators.required]],
      isActive: ['']
    });
    this.loadAllMainCategory();
  }
  removeImage(){
    this.mainCategoryImageSrc="./assets/images/noImage.jpg";

    // alert('');
  }
  removeImage1(){
    this.loadedImage=false;
    this.mainCategory_profile.patchValue("");
    this.mainCategoryImageSrc="./assets/images/noImage.jpg";
  }
  onSubmit() {
    this.dataSaved = false;
    this.saveOrUpdate();
    this.mainCategoryForm.reset();
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
    this.file_store_mainCategory = l;
    if (l.length) {
      const f = l[0];
      const count = l.length > 1 ? `(+${l.length - 1} files)` : "";
      this.mainCategory_profile.patchValue(`${f.name}${count}`);
      this.mainCategory_image = event.target.files[0];
    } else {
      this.mainCategory_profile.patchValue("");
    }

    const reader = new FileReader();
    reader.onload = e => {
      this.mainCategoryImageSrc = reader.result;
    };

    reader.readAsDataURL(this.mainCategory_image);

    const myFormData_cv = new FormData();
    const headers_cv = new HttpHeaders();
    headers_cv.append('Content- Type', 'multipart/form-data');
    headers_cv.append('Accept', 'application/json');
    myFormData_cv.append('imgPath', this.mainCategory_image);
    myFormData_cv.append('code', this.mainCategory_image.name);

    this.http.post(environment.utilityApiBasePath + 'upload-maincategory', myFormData_cv, {
      headers: headers_cv, reportProgress: true,
      observe: 'events'
    }).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.percentage = Math.round(100 * event.loaded / event.total) + '%';
      } else if (event instanceof HttpResponse) {
        console.log('File uploaded successfully!' + JSON.stringify(event));
        this.loadedImage=true;
        this.mainCategory_image = null;
        this.percentage = Math.round(100 * 0) + '%';
      }

    }, error => {


      this.toastr.error('Error while fetching data!', 'Error.');

    });

  }

  saveOrUpdate() {

    this.mainCategory.nameOf = this.mainCategoryForm.get('nameOf').value;
    this.mainCategory.icon = this.mainCategoryForm.get('icon').value;

    this.mainCategory.isActive = this.isChecked;
    this.mainCategory.imgPath = this.mainCategory_profile.value ? this.mainCategory_profile.value : '-';

    if (this.mainCategoryIdToUpdate == null) {
      this.service.Post('major-category', this.mainCategory).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('New Main Category Created!', 'OK!');
          this.loadAllMainCategory();
          this.mainCategoryIdToUpdate = null;
          this.clearLocal();
        },
        err => {

          this.toastr.error('Error while fetching data!', 'Error.');
        }
      );
    } else {
      this.mainCategory.custId = this.mainCategoryIdToUpdate;
      this.mainCategory.nameOf = this.mainCategoryForm.get('nameOf').value;
      this.mainCategory.icon = this.mainCategoryForm.get('icon').value;

      this.mainCategory.isActive = this.isChecked;
      this.mainCategory.imgPath = this.mainCategory_profile.value ? this.mainCategory_profile.value : '-';

      this.service.Update('major-category', this.mainCategory, this.mainCategoryIdToUpdate).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('Main Category Info Updated!', 'Ok!');
          this.loadAllMainCategory();
          this.mainCategoryIdToUpdate = null;
          this.clearLocal();

        },
        err => {
          this.toastr.error('Error while fetching data!', 'Error');
        }
      );
    }
  }
  loadAllMainCategory() {
    this.service.Get('major-category').subscribe(
      (success: any) => {
        this.allMainCategory = success.data;
        console.log(this.allMainCategory);
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }
  onDelete(id: any) {
    const confirmed = window.confirm('Are you sure you want to delete this customer enquiry?');
    if(confirmed){
    this.service.Delete('major-category', id).subscribe(
      () => {
        // success

        this.toastr.success('Main Category Deleted!', 'Ok!');
        this.loadAllMainCategory();
        this.mainCategoryIdToUpdate = null;
        this.clearLocal();
      },
      err => {
        this.toastr.error('Error while fetching data!', 'Eroor');
      }
    );
  }
}
  onEdit(id: any) {
    this.service.GetById('major-category', id).subscribe(
      (item: any) => {
        this.dataSaved = false;
        this.mainCategoryIdToUpdate = item.custId;
        this.mainCategoryForm.controls['nameOf'].setValue(item.nameOf);
        this.mainCategoryForm.controls['icon'].setValue(item.icon);

        if (item.isActive == 'Y') {
          this.isChecked = 'Y';
          this.checked = true;
        }
        else {
          this.isChecked = 'N';
          this.checked = false;
        }

        this.mainCategory_profile.patchValue(item.imgPath);
        this.mainCategoryImageSrc=environment.img_path+'mainCategory/'+item.imgPath;

      },
      err => {
        console.log(err);
      }
    );
  }
  querySearch() {
    this.searchText = this.searchText ? this.searchText : null;
    if (this.searchText !== null) {
      this.service
        .GetById('filter-maincategory', this.searchText)
        .subscribe(
          (success: any) => {
            this.allMainCategory = success;
            this.p = 1; // Reset pagination to the first page
          },
          error => {
            this.toastr.error('Error while fetching data!', 'Error.');
          }
        );
    } else {
      this.loadAllMainCategory();
    }
  }
  
  clearLocal() {
    this.mainCategory_profile.patchValue(null);
    this.mainCategoryForm.reset();
    this.isChecked = 'Y';
    this.checked = true;
    this.mainCategoryImageSrc="./assets/images/noImage.jpg";
  }
}
