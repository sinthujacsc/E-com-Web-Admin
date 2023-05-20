import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-shipping-type',
  templateUrl: './shipping-type.component.html',
  styleUrls: ['./shipping-type.component.scss']
})
export class ShippingTypeComponent implements OnInit {

  shippingType: any = {};
  shippingTypeForm: any;
  allshippingType: any;
  isChecked: string = 'Y';
  checked: boolean = true;

  file_store_shippingType!: FileList;

  percentage: string = '0%';

  dataSaved = false;
  shippingTypeIdToUpdate = null;
  searchTerm: any = { serviceName: '' };
  p: number = 1;
  searchText:any='';


  constructor(public formBuilder: FormBuilder, private toastr: ToastrService,
    private message: ConfirmationDialogService, private http: HttpClient, private service: AuthService

  ) { }

  ngOnInit(): void {

    this.shippingTypeForm = this.formBuilder.group({
      serviceName: ['', [Validators.required]],
      serviceAmount: ['', [Validators.required]],
      isActive: ['']
    });
    this.loadAllshippingType();
  }

  onSubmit() {
    this.dataSaved = false;
    this.saveOrUpdate();
    this.shippingTypeForm.reset();
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
    this.service.GetById('filter-shipping-type',this.searchText).subscribe(
      (success: any) => {
        this.allshippingType= success;
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');
      });
    }else{
      this.loadAllshippingType();
    }
  }
  
  saveOrUpdate() {

    this.shippingType.serviceName = this.shippingTypeForm.get('serviceName').value;
    this.shippingType.serviceAmount = this.shippingTypeForm.get('serviceAmount').value;
    this.shippingType.isActive = this.isChecked;

    if (this.shippingTypeIdToUpdate == null) {
      this.service.Post('shipping-type', this.shippingType).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('New Shipping Type Created!', 'OK!');
          this.loadAllshippingType();
          this.shippingTypeIdToUpdate = null;
          this.clearLocal();
        },
        err => {

          this.toastr.error('Error while fetching data!', 'Error.');
        }
      );
    } else {
      this.shippingType.id = this.shippingTypeIdToUpdate;
      this.shippingType.serviceName = this.shippingTypeForm.get('serviceName').value;
      this.shippingType.serviceAmount = this.shippingTypeForm.get('serviceAmount').value;
      this.shippingType.isActive = this.isChecked;

      this.service.Update('shipping-type', this.shippingType, this.shippingTypeIdToUpdate).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('Shipping Type Info Updated!', 'Ok!');
          this.loadAllshippingType();
          this.shippingTypeIdToUpdate = null;
          this.clearLocal();
        },
        err => {
          this.toastr.error('Error while fetching data!', 'Error');
        }
      );
    }
  }
  loadAllshippingType() {
    this.service.Get('shipping-type').subscribe(
      (success: any) => {
        this.allshippingType = success.data;
        console.log(this.allshippingType);
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }
  onDelete(id: any) {
    this.service.Delete('shipping-type', id).subscribe(
      () => {
        // success

        this.toastr.success('Shipping Type Deleted!', 'Ok!');
        this.loadAllshippingType();
        this.shippingTypeIdToUpdate = null;
        this.clearLocal();
      },
      err => {
        this.toastr.error('Error while fetching data!', 'Eroor');
      }
    );
  }
  onEdit(id: any) {
    this.service.GetById('shipping-type', id).subscribe(
      (item: any) => {
        this.dataSaved = false;
        this.shippingTypeIdToUpdate = item.id;
        this.shippingTypeForm.controls['serviceName'].setValue(item.serviceName);
        this.shippingTypeForm.controls['serviceAmount'].setValue(item.serviceAmount);
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
    this.shippingTypeForm.reset();
    this.isChecked = 'Y';
    this.checked = true;
  }
}
