import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { AddUserComponent } from './add-user/add-user.component';
import { CompanyComponent } from './company/company.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'System'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'add-user'
    },
      {
        path: 'add-user',
        component: AddUserComponent ,
        data: {
          title: 'Add User'
        }
      },
      {
        path: 'activity-log',
        component: ActivityLogComponent ,
        data: {
          title: 'Activity Log'
        }
      },
      {
        path: 'company',
        component: CompanyComponent ,
        data: {
          title: 'Company'
        }
      },
    
     
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
