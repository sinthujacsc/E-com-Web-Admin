import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqCategoryComponent } from './faq-category/faq-category.component';
import { FaqComponent } from './faq/faq.component';
import { ShippingTypeComponent } from './shipping-type/shipping-type.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'FAQs'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'faq'
    },
      {
        path: 'faq',
        component: FaqComponent ,
        data: {
          title: 'FAQs'
        }
      },
      {
        path: 'faq-category',
        component: FaqCategoryComponent ,
        data: {
          title: 'FAQ Category'
        }
      },
      {
        path: 'shipping-type',
        component: ShippingTypeComponent ,
        data: {
          title: 'Shipping Type'
        }
      },
      // {
      //   path: 'sales-brief',
      //   component: SalesBriefComponent ,
      //   data: {
      //     title: 'Sales Brief'
      //   }
      // },
     
    
     
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }
