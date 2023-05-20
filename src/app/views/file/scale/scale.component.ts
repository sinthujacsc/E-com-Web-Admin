import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-scale',
  templateUrl: './scale.component.html',
  styleUrls: ['./scale.component.scss']
})
export class ScaleComponent implements OnInit {

  scale: any = {};
  scaleForm: any;
  allscale: any;
  isChecked: string = 'Y';
  checked: boolean = true;

  file_store_scale!: FileList;
  scale_image: any;

  percentage: string = '0%';

  dataSaved = false;
  scaleIdToUpdate = null;
  searchTerm: any = { nameOf: '' };
  p: number = 1;
  searchText:any='';

  constructor(public formBuilder: FormBuilder, private toastr: ToastrService,
    private message: ConfirmationDialogService, private http: HttpClient, private service: AuthService

  ) { }

  ngOnInit(): void {

    this.scaleForm = this.formBuilder.group({
      nameOf: ['', [Validators.required]],
      isActive: ['']
    });
    this.loadAllscale();
  }

  onSubmit() {
    this.dataSaved = false;
    this.saveOrUpdate();
    this.scaleForm.reset();
  }
  checkValue(e: any) {
    if (e.target.checked === true) {
      this.isChecked = 'Y';
      this.checked = true;
    } else {
      this.isChecked = 'N';
      this.checked = false;
    }
  }

  
  saveOrUpdate() {

    this.scale.nameOf = this.scaleForm.get('nameOf').value;
    this.scale.isActive = this.isChecked;

    if (this.scaleIdToUpdate == null) {
      this.service.Post('scale', this.scale).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('New Scale Created!', 'OK!');
          this.loadAllscale();
          this.scaleIdToUpdate = null;
          this.clearLocal();
        },
        err => {

          this.toastr.error('Error while fetching data!', 'Error.');
        }
      );
    } else {
      this.scale.custId = this.scaleIdToUpdate;
      this.scale.nameOf = this.scaleForm.get('nameOf').value;
      this.scale.isActive = this.isChecked;

      this.service.Update('scale', this.scale, this.scaleIdToUpdate).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('Scale Info Updated!', 'Ok!');
          this.loadAllscale();
          this.scaleIdToUpdate = null;
          this.clearLocal();
        },
        err => {
          this.toastr.error('Error while fetching data!', 'Error');
        }
      );
    }
  }
  loadAllscale() {
    this.service.Get('scale').subscribe(
      (success: any) => {
        this.allscale = success.data;
        console.log(this.allscale);
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }
  onDelete(id: any) {
    this.service.Delete('scale', id).subscribe(
      () => {
        // success

        this.toastr.success('Scale Deleted!', 'Ok!');
        this.loadAllscale();
        this.scaleIdToUpdate = null;
        this.clearLocal();
      },
      err => {
        this.toastr.error('Error while fetching data!', 'Eroor');
      }
    );
  }
  querySearch() {
    this.searchText=this.searchText?this.searchText:null;
    if(this.searchText != null){
    this.service.GetById('filter-scale',this.searchText).subscribe(
      (success: any) => {
        this.allscale= success;
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');
      });
    }else{
      this.loadAllscale();
    }
  }
  onEdit(id: any) {
    this.service.GetById('scale', id).subscribe(
      (item: any) => {
        this.dataSaved = false;
        this.scaleIdToUpdate = item.custId;
        this.scaleForm.controls['nameOf'].setValue(item.nameOf);
        if (item.isActive == 'Y') {
          this.isChecked = 'Y';
          this.checked = true;
        }
        else {
          this.isChecked = 'N';
          this.checked = false;
        }

      

      },
      err => {
        console.log(err);
      }
    );
  }
  clearLocal() {
    this.scaleForm.reset();
    this.isChecked = 'Y';
    this.checked = true;
  }
}
