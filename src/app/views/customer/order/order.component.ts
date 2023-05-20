import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  
  allOrder: any;
  // searchTerm: any = { nameOf: '' };
  p: number = 1;
  orderIdToUpdate = null;
  searchText:any='';
  allProducts:any;
  serverImgPath = environment.img_path + 'product/';

  
  constructor(private modalService: NgbModal,private router: Router,private service: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadAllOrder();
   
   
  }
  querySearch() {
    this.searchText=this.searchText?this.searchText:null;
    if(this.searchText != null){
    this.service.GetById('filter-order',this.searchText).subscribe(
      (success: any) => {
        this.allOrder= success;
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');
      });
    }else{
      this.loadAllOrder();
    }
  }

  loadAllOrder() {
    this.service.Get('sale-brief').subscribe(
      (success: any) => {
        this.allOrder = success.data;
        console.log(this.allOrder);
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }
  onView(content:any,size:any,id:any){
    this.service.GetById('get-products', id).subscribe(
      (item: any) => {       
        this.allProducts=item;
        console.log(this.allProducts);
        setTimeout(() => {
          this.modalService.open(content, { size: size });

        }, 2000);
       
      },
      err => {
        console.log(err);
      }
    );
   
  }
  onDelete(id: any) {
    // Display a confirmation dialog to the user
    if (confirm('Are you sure you want to delete this item?')) {
    this.service.Delete('sale-brief', id).subscribe(
    () => {
    // Success
    this.toastr.success('Order Deleted!', 'Ok!');
    location.reload(); // Reload the page
  },
    err => {
    // Error
    this.toastr.error('Error while fetching data!', 'Error');
    }
    );
    }
  }
  // onEdit(id: any) {

  // }


}

