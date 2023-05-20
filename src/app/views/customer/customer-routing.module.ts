import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { OrderComponent } from './order/order.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Customer'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'order'
      },
      {
        path: 'order',
        component: OrderComponent ,
        data: {
          title: 'Order'
        }
      },
      {
        path: 'edit-order/:billId',
        component: EditOrderComponent ,
        data: {
          title: 'edit Order'
        }
      },
      
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
