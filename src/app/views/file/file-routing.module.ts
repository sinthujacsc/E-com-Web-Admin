import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { BrandComponent } from './brand/brand.component';
import { CustomerComponent } from './customer/customer.component';
import { MaincategoryComponent } from './maincategory/maincategory.component';
import { ProductComponent } from './product/product.component';
import { ScaleComponent } from './scale/scale.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';



const routes: Routes = [
  {
    path: '',
    data: {
      title: 'File'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'main-category'
      },
      {
        path: 'main-category',
        component: MaincategoryComponent ,
        data: {
          title: 'Main Category'
        }
      },
      {
        path: 'sub-category',
        component: SubcategoryComponent ,
        data: {
          title: 'Sub Category'
        }
      },
      {
        path: 'scale',
        component: ScaleComponent ,
        data: {
          title: 'Scale'
        }
      },
      {
        path: 'product',
        component: ProductComponent ,
        data: {
          title: 'Product'
        }
      },
      {
        path: 'customer',
        component: CustomerComponent ,
        data: {
          title: 'Customer'
        }
      },
      {
        path: 'add-product',
        component: AddProductComponent ,
        data: {
          title: 'Add Product'
        }
      },
      {
        path: 'edit-product/:code',
        component: AddProductComponent ,
        data: {
          title: 'Edit Product'
        }
      },
      {
        path: 'brand',
        component: BrandComponent ,
        data: {
          title: 'brand'
        }
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileRoutingModule { }
