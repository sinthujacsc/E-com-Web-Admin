import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDatepickerDayView } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-day-view';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  allProduct: any;
  // searchTerm: any = { nameOf: '' };
  p: number = 1;
  serverImgPath = environment.img_path + 'product/';
  productIdToUpdate = null;
  searchText:any='';
  
  constructor(private service: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadAllProduct();
   
   
  }
  querySearch() {
    this.searchText=this.searchText?this.searchText:null;
    if(this.searchText != null){
    this.service.GetById('filter-product',this.searchText).subscribe(
      (success: any) => {
        this.allProduct= success;
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');
      });
    }else{
      this.loadAllProduct();
    }
  }

  loadAllProduct() {
    this.service.Get('product').subscribe(
      (success: any) => {
        this.allProduct = success;
        console.log(this.allProduct);
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }
  onDelete(id: any) {
    this.service.Delete('product', id).subscribe(
      () => {
        // success

        this.toastr.success('Product Deleted!', 'Ok!');
        this.loadAllProduct();
        this.productIdToUpdate = null;
      },
      err => {
        this.toastr.error('Error while fetching data!', 'Eroor');
      }
    );
  }
  onEdit(id: any) {

  }


}
