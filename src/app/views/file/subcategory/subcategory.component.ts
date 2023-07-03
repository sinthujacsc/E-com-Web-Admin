import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit {

  searchText:any='';
  subCategory: any = {};
  subCategoryForm: any;
  allsubCategory: any;
  isChecked: string = 'Y';
  checked: boolean = true;

  file_store_subCategory!: FileList;
  subCategory_image: any;

  subCategory_profile: FormControl = new FormControl("");
  percentage: string = '0%';
  loadedImage:boolean=false;
  dataSaved = false;
  subCategoryIdToUpdate = null;
  searchTerm: any = { nameOf: '' };
  p: number = 1;
  serverImgPath = environment.img_path+'subCategory/';
  subCategoryImageSrc:any="./assets/images/noImage.jpg";


  constructor(public formBuilder: FormBuilder, private toastr: ToastrService,
    private message: ConfirmationDialogService, private http: HttpClient, private service: AuthService

  ) { }

  ngOnInit(): void {

    this.subCategoryForm = this.formBuilder.group({
      nameOf: ['', [Validators.required]],
      isActive: ['']
    });
    this.loadAllsubCategory();
  }
  removeImage(){
    this.subCategoryImageSrc="./assets/images/noImage.jpg";

  }
  removeImage1(){
    this.loadedImage=false;
    this.subCategory_profile.patchValue("");
    this.subCategoryImageSrc="./assets/images/noImage.jpg";

  }
  onSubmit() {
    this.dataSaved = false;
    this.saveOrUpdate();
    this.subCategoryForm.reset();
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
      this.subCategory_profile.patchValue(`${f.name}${count}`);
      this.subCategory_image = event.target.files[0];
    } else {
      this.subCategory_profile.patchValue("");
    }

    const reader = new FileReader();
    reader.onload = e => {
      this.subCategoryImageSrc = reader.result;
    };

    reader.readAsDataURL(this.subCategory_image);

    const myFormData_cv = new FormData();
    const headers_cv = new HttpHeaders();
    headers_cv.append('Content- Type', 'multipart/form-data');
    headers_cv.append('Accept', 'application/json');
    myFormData_cv.append('imgPath', this.subCategory_image);
    myFormData_cv.append('code', this.subCategory_image.name);

    this.http.post(environment.utilityApiBasePath + 'upload-subcategory', myFormData_cv, {
      headers: headers_cv, reportProgress: true,
      observe: 'events'
    }).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.percentage = Math.round(100 * event.loaded / event.total) + '%';
      } else if (event instanceof HttpResponse) {
        console.log('File uploaded successfully!' + JSON.stringify(event));
        this.loadedImage=true;
        this.subCategory_image = null;
        this.percentage = Math.round(100 * 0) + '%';
      }

    }, error => {


      this.toastr.error('Error while fetching data!', 'Error.');

    });

  }
  querySearch() {
    this.searchText=this.searchText?this.searchText:null;
    if(this.searchText != null){
    this.service.GetById('filter-subcategory',this.searchText).subscribe(
      (success: any) => {
        this.allsubCategory= success;
        this.p = 1; // Reset pagination to the first page

      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');
      });
    }else{
      this.loadAllsubCategory();
    }
  }
  saveOrUpdate() {

    this.subCategory.nameOf = this.subCategoryForm.get('nameOf').value;
    this.subCategory.isActive = this.isChecked;
    this.subCategory.imgPath = this.subCategory_profile.value ? this.subCategory_profile.value : '-';

    if (this.subCategoryIdToUpdate == null) {
      this.service.Post('sub-category', this.subCategory).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('New sub Category Created!', 'OK!');
          this.loadAllsubCategory();
          this.subCategoryIdToUpdate = null;
          this.clearLocal();
        },
        err => {

          this.toastr.error('Error while fetching data!', 'Error.');
        }
      );
    } else {
      this.subCategory.custId = this.subCategoryIdToUpdate;
      this.subCategory.nameOf = this.subCategoryForm.get('nameOf').value;
      this.subCategory.isActive = this.isChecked;
      this.subCategory.imgPath = this.subCategory_profile.value ? this.subCategory_profile.value : '-';

      this.service.Update('sub-category', this.subCategory, this.subCategoryIdToUpdate).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('sub Category Info Updated!', 'Ok!');
          this.loadAllsubCategory();
          this.subCategoryIdToUpdate = null;
          this.clearLocal();
        },
        err => {
          this.toastr.error('Error while fetching data!', 'Error');
        }
      );
    }
  }
  loadAllsubCategory() {
    this.service.Get('sub-category').subscribe(
      (success: any) => {
        this.allsubCategory = success.data;
        console.log(this.allsubCategory);
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }
  onDelete(id: any) {
    const confirmed = window.confirm('Are you sure you want to delete this customer enquiry?');
    if(confirmed){
    this.service.Delete('sub-category', id).subscribe(
      () => {
        // success

        this.toastr.success('Sub Category Deleted!', 'Ok!');
        this.loadAllsubCategory();
        this.subCategoryIdToUpdate = null;
        this.clearLocal();
      },
      err => {
        this.toastr.error('Error while fetching data!', 'Eroor');
      }
    );
    }
  }
  onEdit(id: any) {
    this.service.GetById('sub-category', id).subscribe(
      (item: any) => {
        this.dataSaved = false;
        this.subCategoryIdToUpdate = item.custId;
        this.subCategoryForm.controls['nameOf'].setValue(item.nameOf);
        if (item.isActive == 'Y') {
          this.isChecked = 'Y';
          this.checked = true;
        }
        else {
          this.isChecked = 'N';
          this.checked = false;
        }

        this.subCategory_profile.patchValue(item.imgPath);
        this.subCategoryImageSrc=environment.img_path+'subCategory/'+item.imgPath;

      },
      err => {
        console.log(err);
      }
    );
  }
  clearLocal() {
    this.subCategory_profile.patchValue(null);
    this.subCategoryForm.reset();
    this.isChecked = 'Y';
    this.checked = true;
    this.subCategoryImageSrc="./assets/images/noImage.jpg";

  }
}
