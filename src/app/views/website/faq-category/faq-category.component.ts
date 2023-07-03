import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-faq-category',
  templateUrl: './faq-category.component.html',
  styleUrls: ['./faq-category.component.scss']
})
export class FaqCategoryComponent implements OnInit {

  faqCategory: any = {};
  faqCategoryForm: any;
  allfaqCategory: any;
  isChecked: string = 'Y';
  checked: boolean = true;

  file_store_faqCategory!: FileList;

  percentage: string = '0%';

  dataSaved = false;
  faqCategoryIdToUpdate = null;
  searchText:any;
  p: number = 1;


  constructor(public formBuilder: FormBuilder, private toastr: ToastrService,
    private message: ConfirmationDialogService, private http: HttpClient, private service: AuthService

  ) { }

  ngOnInit(): void {

    this.faqCategoryForm = this.formBuilder.group({
      nameOf: ['', [Validators.required]],
      isActive: ['']
    });
    this.loadAllfaqCategory();
  }

  onSubmit() {
    this.dataSaved = false;
    this.saveOrUpdate();
    this.faqCategoryForm.reset();
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

    this.faqCategory.nameOf = this.faqCategoryForm.get('nameOf').value;
    this.faqCategory.isActive = this.isChecked;

    if (this.faqCategoryIdToUpdate == null) {
      this.service.Post('faq-category', this.faqCategory).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('New Faq Category Created!', 'OK!');
          this.loadAllfaqCategory();
          this.faqCategoryIdToUpdate = null;
          this.clearLocal();
        },
        err => {

          this.toastr.error('Error while fetching data!', 'Error.');
        }
      );
    } else {
      this.faqCategory.custId = this.faqCategoryIdToUpdate;
      this.faqCategory.nameOf = this.faqCategoryForm.get('nameOf').value;
      this.faqCategory.isActive = this.isChecked;

      this.service.Update('faq-category', this.faqCategory, this.faqCategoryIdToUpdate).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('Faq Category Info Updated!', 'Ok!');
          this.loadAllfaqCategory();
          this.faqCategoryIdToUpdate = null;
          this.clearLocal();
        },
        err => {
          this.toastr.error('Error while fetching data!', 'Error');
        }
      );
    }
  }
  loadAllfaqCategory() {
    this.service.Get('faq-category').subscribe(
      (success: any) => {
        this.allfaqCategory = success.data;
        console.log(this.allfaqCategory);
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }
  querySearch() {
    this.searchText=this.searchText?this.searchText:null;
    if(this.searchText != null){
    this.service.GetById('filter-faq-category',this.searchText).subscribe(
      (success: any) => {
        this.allfaqCategory= success;
        this.p = 1; // Reset pagination to the first page

      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');
      });
    }else{
      this.loadAllfaqCategory();
    }
  }
  onDelete(id: any) {
    const confirmed = window.confirm('Are you sure you want to delete this customer enquiry?');
    if(confirmed){
    this.service.Delete('faq-category', id).subscribe(
      () => {
        // success

        this.toastr.success('Faq Category Deleted!', 'Ok!');
        this.loadAllfaqCategory();
        this.faqCategoryIdToUpdate = null;
        this.clearLocal();
      },
      err => {
        this.toastr.error('Error while fetching data!', 'Eroor');
      }
    );
    }
  }
  onEdit(id: any) {
    this.service.GetById('faq-category', id).subscribe(
      (item: any) => {
        this.dataSaved = false;
        this.faqCategoryIdToUpdate = item.custId;
        this.faqCategoryForm.controls['nameOf'].setValue(item.nameOf);
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
    this.faqCategoryForm.reset();
    this.isChecked = 'Y';
    this.checked = true;

  }
}

