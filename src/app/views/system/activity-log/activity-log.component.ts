import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {
  activityLog: any;
  activityLogData:any;
  searchTerm: any = { name: '' };
  p: number = 1;
  searchText:any;
  constructor(private service: AuthService, private toastr: ToastrService,private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.loadAllActivityLog();

  }
  loadAllActivityLog() {
    this.service.Get('activity-log').subscribe(
      (success: any) => {
        this.activityLog = success.data;
        console.log(this.activityLog);
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }

  onDelete(id: any) {
    this.service.Delete('activity-log', id).subscribe(
      () => {
        // success

        this.toastr.success('Product Deleted!', 'Ok!');
        this.loadAllActivityLog();
      },
      err => {
        this.toastr.error('Error while fetching data!', 'Eroor');
      }
    );
  }
  onView(content:any,size:any,id:any){
    this.service.GetById('activity-log', id).subscribe(
      (item: any) => {
        this.activityLogData=JSON.parse(item.properties);
        console.log(this.activityLogData);
      },
      err => {
        console.log(err);
      }
    );
    this.modalService.open(content, { size: size });
  }
  querySearch() {
    this.searchText=this.searchText?this.searchText:null;
    if(this.searchText != null){
    this.service.GetById('filter-activity',this.searchText).subscribe(
      (success: any) => {
        this.activityLog= success;
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');
      });
    }else{
      this.loadAllActivityLog();
    }
  }
}

