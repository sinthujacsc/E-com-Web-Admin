import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  brand: any = {};
  brandForm: any;
  allbrand: any;
  isChecked: string = 'Y';
  checked: boolean = true;

  file_store_brand!: FileList;

  percentage: string = '0%';

  dataSaved = false;
  brandIdToUpdate = null;
  searchTerm: any = { nameOf: '' };
  p: number = 1;
  searchText:any='';


  constructor(public formBuilder: FormBuilder, private toastr: ToastrService,
    private message: ConfirmationDialogService, private http: HttpClient, private service: AuthService

  ) { }

  ngOnInit(): void {

    this.brandForm = this.formBuilder.group({
      nameOf: ['', [Validators.required]],
      isActive: ['']
    });
    this.loadAllbrand();
  }

  onSubmit() {
    this.dataSaved = false;
    this.saveOrUpdate();
    this.brandForm.reset();
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
  querySearch() {
    
    this.searchText=this.searchText?this.searchText:null;
    if(this.searchText != null){
    this.service.GetById('filter-brand',this.searchText).subscribe(
      (success: any) => {
        this.allbrand= success;
        this.p = 1; // Reset pagination to the first page
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');
      });
    }else{
      this.loadAllbrand();
    }
  }
  
  saveOrUpdate() {

    this.brand.nameOf = this.brandForm.get('nameOf').value;
    this.brand.isActive = this.isChecked;

    if (this.brandIdToUpdate == null) {
      this.service.Post('brand', this.brand).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('New Brand Created!', 'OK!');
          this.loadAllbrand();
          this.brandIdToUpdate = null;
          this.clearLocal();
        },
        err => {

          this.toastr.error('Error while fetching data!', 'Error.');
        }
      );
    } else {
      this.brand.custId = this.brandIdToUpdate;
      this.brand.nameOf = this.brandForm.get('nameOf').value;
      this.brand.isActive = this.isChecked;

      this.service.Update('brand', this.brand, this.brandIdToUpdate).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('Brand Info Updated!', 'Ok!');
          this.loadAllbrand();
          this.brandIdToUpdate = null;
          this.clearLocal();
        },
        err => {
          this.toastr.error('Error while fetching data!', 'Error');
        }
      );
    }
  }
  loadAllbrand() {
    this.service.Get('brand').subscribe(
      (success: any) => {
        this.allbrand = success.data;
        console.log(this.allbrand);
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }
  onDelete(id: any) {
    const confirmed = window.confirm('Are you sure you want to delete this customer enquiry?');
    if(confirmed){
    this.service.Delete('brand', id).subscribe(
      () => {
        // success

        this.toastr.success('Brand Deleted!', 'Ok!');
        this.loadAllbrand();
        this.brandIdToUpdate = null;
        this.clearLocal();
      },
      err => {
        this.toastr.error('Error while fetching data!', 'Eroor');
      }
    );
  }
}
  onEdit(id: any) {
    this.service.GetById('brand', id).subscribe(
      (item: any) => {
        this.dataSaved = false;
        this.brandIdToUpdate = item.custId;
        this.brandForm.controls['nameOf'].setValue(item.nameOf);
        if (item.isActive == 'Y') {
          this.isChecked = 'Y';
          this.checked = true;
        }
        else {
          this.isChecked = 'N';
          this.checked = false;
        }

      },
      err => {
        console.log(err);
      }
    );
  }
  clearLocal() {
    this.brandForm.reset();
    this.isChecked = 'Y';
    this.checked = true;
  }
 
}
