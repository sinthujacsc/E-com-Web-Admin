import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  allCustomer: any;
  searchTerm: any = { firstName: '' };
  p: number = 1;
  serverImgPath = environment.img_path + 'customer/';
  CustomerIdToUpdate = null;
  searchText:any='';
  
  constructor(private service: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadAllCustomer();
   
  }
  querySearch() {
    this.searchText=this.searchText?this.searchText:null;
    if(this.searchText != null){
    this.service.GetById('filter-customer',this.searchText).subscribe(
      (success: any) => {
        this.allCustomer= success;
        this.p = 1; // Reset pagination to the first page
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');
      });
    }else{
      this.loadAllCustomer();
    }
  }
  loadAllCustomer() {
    this.service.Get('customer').subscribe(
      (success: any) => {
        this.allCustomer = success.data;
        console.log(this.allCustomer);
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');
      });
  }
  onDelete(id: any) {
    const confirmed = window.confirm('Are you sure you want to delete this customer enquiry?');
    if(confirmed){
    this.service.Delete('customer', id).subscribe(
      () => {
        // success

        this.toastr.success('Customer Deleted!', 'Ok!');
        this.loadAllCustomer();
        this.CustomerIdToUpdate = null;
      },
      err => {
        this.toastr.error('Error while fetching data!', 'Eroor');
      }
    );
  }
}
  onEdit(id: any) {

  }


}
