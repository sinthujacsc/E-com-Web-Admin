import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerEnquiryComponent } from './customer-enquiry/customer-enquiry.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Enquiry'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'customer-enquiry'
    },
      {
        path: 'customer-enquiry',
        component: CustomerEnquiryComponent ,
        data: {
          title: 'Customer Enquiry'
        }
      },
     
    
     
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnquiryRoutingModule { }
