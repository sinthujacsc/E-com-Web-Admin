import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-customer-enquiry',
  templateUrl: './customer-enquiry.component.html',
  styleUrls: ['./customer-enquiry.component.scss']
})
export class CustomerEnquiryComponent implements OnInit {
  customerEnquiry: any;
  customerEnquiryData:any;
  searchText:any;
  p: number = 1;
  constructor(private service: AuthService, private toastr: ToastrService,private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.loadAllCustomerEnquiry();

  }
  loadAllCustomerEnquiry() {
    this.service.Get('customer-enquiry').subscribe(
      (success: any) => {
        this.customerEnquiry = success.data;
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }

  onDelete(id: any) {
    const confirmed = window.confirm('Are you sure you want to delete this customer enquiry?');
    if (confirmed) {
    this.service.Delete('customer-enquiry', id).subscribe(
      () => {
        // success
        
        this.toastr.success('Customer Enquiry Deleted!', 'Ok!');
        this.loadAllCustomerEnquiry();
      },
      err => {
        this.toastr.error('Error while fetching data!', 'Eroor');
      }
    );
  }
}

  onView(content:any,size:any,id:any){
    this.service.GetById('customer-enquiry', id).subscribe(
      (item: any) => {
        this.customerEnquiryData=item;
        console.log(this.customerEnquiryData);

        setTimeout(() => {
          this.modalService.open(content, { size: size });
          this.loadAllCustomerEnquiry();
        }, 2000);
       
      },
      err => {
        console.log(err);
      }
    );
   
  }
  querySearch() {
    this.searchText=this.searchText?this.searchText:null;
    if(this.searchText != null){
    this.service.GetById('filter-customer-enquiry',this.searchText).subscribe(
      (success: any) => {
        this.customerEnquiry= success;
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');
      });
    }else{
      this.loadAllCustomerEnquiry();
    }
  }
  
}


