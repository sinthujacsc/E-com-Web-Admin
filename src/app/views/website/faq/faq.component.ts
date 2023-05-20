import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  faq: any = {};
  faqForm: any;
  allfaq: any;
  allFaqCategory: any;
  isChecked: string = 'Y';
  checked: boolean = true;

  file_store_faq!: FileList;

  percentage: string = '0%';

  dataSaved = false;
  faqIdToUpdate = null;
  searchText:any;
  p: number = 1;


  constructor(public formBuilder: FormBuilder, private toastr: ToastrService,
    private message: ConfirmationDialogService, private http: HttpClient, private service: AuthService

  ) { }

  ngOnInit(): void {

    this.faqForm = this.formBuilder.group({
      faqcategory_id: ['', [Validators.required]],
      question: ['', [Validators.required]],
      answer: ['', [Validators.required]],
      isActive: ['']
    });
    this.loadAllfaq();
    this.loadAllFaqCategory();
  }

  onSubmit() {
    this.dataSaved = false;
    this.saveOrUpdate();
    this.faqForm.reset();
  }
  loadAllFaqCategory() {
    this.service.Get('faq-category').subscribe(
      (success: any) => {
        this.allFaqCategory = success.data;
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }
  querySearch() {
    this.searchText=this.searchText?this.searchText:null;
    if(this.searchText != null){
    this.service.GetById('filter-faq',this.searchText).subscribe(
      (success: any) => {
        this.allfaq= success.data;
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');
      });
    }else{
      this.loadAllfaq();
    }
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

    this.faq.faqcategory_id = this.faqForm.get('faqcategory_id').value;
    this.faq.question = this.faqForm.get('question').value;
    this.faq.answer = this.faqForm.get('answer').value;
    this.faq.isActive = this.isChecked;

    if (this.faqIdToUpdate == null) {
      this.service.Post('faq', this.faq).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('New FAQ Created!', 'OK!');
          this.loadAllfaq();
          this.faqIdToUpdate = null;
          this.clearLocal();
        },
        err => {

          this.toastr.error('Error while fetching data!', 'Error.');
        }
      );
    } else {
      this.faq.id = this.faqIdToUpdate;
      this.faq.faqcategory_id = this.faqForm.get('faqcategory_id').value;
      this.faq.question = this.faqForm.get('question').value;
      this.faq.answer = this.faqForm.get('answer').value;
      this.faq.isActive = this.isChecked;

      this.service.Update('faq', this.faq, this.faqIdToUpdate).subscribe(
        () => {
          this.dataSaved = true;
          // success
          this.toastr.success('FAQ Info Updated!', 'Ok!');
          this.loadAllfaq();
          this.faqIdToUpdate = null;
          this.clearLocal();
        },
        err => {
          this.toastr.error('Error while fetching data!', 'Error');
        }
      );
    }
  }
  loadAllfaq() {
    this.service.Get('faq').subscribe(
      (success: any) => {
        this.allfaq = success.data;
        console.log(this.allfaq);
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }
  onDelete(id: any) {
    this.service.Delete('faq', id).subscribe(
      () => {
        // success

        this.toastr.success('FAQ Deleted!', 'Ok!');
        this.loadAllfaq();
        this.faqIdToUpdate = null;
        this.clearLocal();
      },
      err => {
        this.toastr.error('Error while fetching data!', 'Eroor');
      }
    );
  }
  onEdit(id: any) {
    this.service.GetById('faq', id).subscribe(
      (item: any) => {
        this.dataSaved = false;
        this.faqIdToUpdate = item.id;
        this.faqForm.controls['faqcategory_id'].setValue(item.faqcategory_id);
        this.faqForm.controls['question'].setValue(item.question);
        this.faqForm.controls['answer'].setValue(item.answer);

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
    this.faqForm.reset();
    this.isChecked = 'Y';
    this.checked = true;

  }
}

