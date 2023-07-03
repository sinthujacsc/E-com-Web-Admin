import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnyARecord } from 'dns';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  @ViewChild('priceInput', { static: false }) priceInput!: ElementRef;
  @ViewChild('discountRInput', { static: false }) discountRInput!: ElementRef;
  @ViewChild('discountAInput', { static: false }) discountAInput!: ElementRef;
  @ViewChild('vatRInput', { static: false }) vatRInput!: ElementRef;
  @ViewChild('vatAInput', { static: false }) vatAInput!: ElementRef;


  addProductForm: any;
  allMainCategory: any;
  allsubCategory: any;
  allscale: any;
  allbrand: any;
  product: any = {};
  allproduct: any;
  isChecked: string = 'Y';
  checked: boolean = true;
  isCheckedNew: string = 'Y';
  checkedNew: boolean = true;
  display_image: FormControl = new FormControl("");

  file_store1!: FileList;
  file_store_product!: FileList;
  product_image: any;

  product_profile: FormControl = new FormControl("");
  percentage: string = '0%';
  percentage1: string = '0%';

  public color: string = '#2889e9';
  dataSaved = false;
  productIdToUpdate = null;
  searchTerm: any = { nameOf: '' };
  p: number = 1;
  serverImgPath = environment.img_path;
  productImageSrc: any = "./assets/images/noImage.jpg";
  productCode: string = '';
  isEdit: boolean = false;
  particularProduct: any;
  singleProduct: any;
  instance1:any=1;
  mainCategoryId:any;
  subCategoryId:any;
  scaleId:any;
  brandId:any;
  isSuccess: boolean = false;
  images:any;
  loadedImage:boolean=false;



  selectedFiles?: FileList;
  progressInfos: any[] = [];
  messages: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;
  currentHoverIndex: number=-1;


 
  config = {
    displayFn:(item: any) => { return item.description; }, 
    displayKey:"description", //if objects array passed which key to be displayed defaults to description
    search:true ,//true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder:'Select', // text to be displayed when no item is selected defaults to Select,
    customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: 0, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder:'Search', // label thats displayed in search input,
    searchOnKey: 'description', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    // enable select all option to select all available items, default is false
  };
  
  constructor(private cpService: ColorPickerService,public formBuilder: FormBuilder, private toastr: ToastrService,
    private message: ConfirmationDialogService, private http: HttpClient, private service: AuthService, private router: Router, private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.addProductForm = this.formBuilder.group({
      images: this.formBuilder.array([]),
      nameOf: ['', [Validators.required]],
      description: ['',[Validators.required]],
      isActive: [''],
      mainCategory_id: ['',[Validators.required]],
      subCategory_id: ['',[Validators.required]],
      scale_id: ['',[Validators.required]],
      brand_id: ['',[Validators.required]],
      sku: [''],
      price: ['0.00', [Validators.required]],
      discountRate: ['0.00'],
      discountAmount: ['0.00'],
      vatRate: ['0.00'],
      vatAmount: ['0.00'],
      isNew: [''],


    });
    this.loadAllMainCategory();
    this.loadAllsubCategory();
    this.loadAllscale();
    this.loadAllBrand();

    this.route.params.subscribe(data => {
      this.productCode = data['code'];
      if (this.productCode != undefined) {
        if (this.productCode.length > 0) {
          this.isEdit = true;
          this.loadProductByCode();
        }
        else {
          this.isEdit = false;
        }
      }

    });
  }
  // selectFiles(event: any): void {
  //   this.messages = [];
  //   this.progressInfos = [];
  //   this.selectedFiles = event.target.files;

  //   this.previews = [];
  //   if (this.selectedFiles && this.selectedFiles[0]) {
  //     const numberOfFiles = this.selectedFiles.length;
  //     for (let i = 0; i < numberOfFiles; i++) {
  //       const reader = new FileReader();

  //       reader.onload = (e: any) => {
  //         this.previews.push(e.target.result);
  //       };

  //       reader.readAsDataURL(this.selectedFiles[i]);
  //     }
  //   }
  // }
  public onChangeColor(color: string,i:any): void {
    var id = i.toString();
    this.color = color;
    (document.getElementById(id.toString()) as HTMLInputElement).value = color;
    (document.getElementById(id.toString()) as HTMLInputElement).style.backgroundColor = color;
  }
  onDeleteRowImages(rowIndex: number) {
    let rows = this.addProductForm.get('images') as FormArray;
    rows.removeAt(rowIndex);
  }
  // selectionChanged(event:any){
  //   this.mainCategoryId=event.value.id;
  // }
  // selectionChanged1(event:any){
  //   this.subCategoryId=event.value.id;    
  // }
  // selectionChanged2(event:any){   
  //   this.scaleId=event.value.id;
  // }
  // selectionChanged3(event:any){
  //   this.brandId=event.value.id;
  // }
  loadProductByCode() {

    this.service.GetById('product-by-code', this.productCode).subscribe(

      (success: any) => {
        this.loadImage();
        this.particularProduct = success.data;
        this.addProductForm.controls['nameOf'].setValue(this.particularProduct[0].nameOf);
        this.addProductForm.controls['mainCategory_id'].setValue(this.particularProduct[0].mainCategory_id);
        this.addProductForm.controls['subCategory_id'].setValue(this.particularProduct[0].subCategory_id);
        this.addProductForm.controls['scale_id'].setValue(this.particularProduct[0].scale_id);
        this.addProductForm.controls['brand_id'].setValue(this.particularProduct[0].brand_id);
        this.addProductForm.controls['vatRate'].setValue(this.particularProduct[0].vatRate);
        this.addProductForm.controls['vatAmount'].setValue(this.particularProduct[0].vatAmount);
        this.addProductForm.controls['discountRate'].setValue(this.particularProduct[0].discountRate);
        this.addProductForm.controls['discountAmount'].setValue(this.particularProduct[0].discountAmount);
        this.addProductForm.controls['sku'].setValue(this.particularProduct[0].sku);
        this.addProductForm.controls['price'].setValue(this.particularProduct[0].price);
        this.addProductForm.controls['description'].setValue(this.particularProduct[0].description);


        // this.mainCategoryId=this.particularProduct[0].mainCategory_id;
        // this.subCategoryId=this.particularProduct[0].subCategory_id;
        // this.scaleId=this.particularProduct[0].scale_id;
        // this.brandId=this.particularProduct[0].brand_id;

        if (this.particularProduct[0].isActive == 'Y') {
          this.isChecked = 'Y';
          this.checked = true;
        }
        else {
          this.isChecked = 'N';
          this.checked = false;
        }
        if (this.particularProduct[0].isActive == 'Y') {
          this.isCheckedNew = 'Y';
          this.checkedNew = true;
        }
        else {
          this.isCheckedNew = 'N';
          this.checkedNew = false;
        }
        this.product_profile.patchValue(this.particularProduct[0].imgPath);
        this.productImageSrc = environment.img_path + 'product/' + this.particularProduct[0].imgPath;

      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }
  loadImage(){
    this.service.GetById('image-by-product',this.productCode).subscribe(
      (success: any) => {
        let rows = this.addProductForm.get('images') as FormArray;
        var data = success;
        console.log(data.length);

        for (let i = 0; i < data.length; i++) {
          rows.push(this.formBuilder.group({            
            imgPath: [data[i].imgPath],
            color: [data[i].color],            
          }));         
          // (document.getElementById(i.toString()) as HTMLInputElement).value = data[i].color;
        }
        setTimeout(() => {
          for (let i = 0; i < data.length; i++) {
            (document.getElementById(i.toString()) as HTMLInputElement).style.backgroundColor = data[i].color;        
          }          
        }, 2000);
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');
      });
  }

  handleImage(l: FileList, event: any): void {
    this.file_store_product = l;
    if (l.length) {
      const f = l[0];
      const count = l.length > 1 ? `(+${l.length - 1} files)` : "";
      this.product_profile.patchValue(`${f.name}${count}`);
      this.product_image = event.target.files[0];
    } else {
      this.product_profile.patchValue("");
    }

    const reader = new FileReader();
    reader.onload = e => {
      this.productImageSrc = reader.result;
    };

    reader.readAsDataURL(this.product_image);

    const myFormData_cv = new FormData();
    const headers_cv = new HttpHeaders();
    headers_cv.append('Content- Type', 'multipart/form-data');
    headers_cv.append('Accept', 'application/json');
    myFormData_cv.append('imgPath', this.product_image);
    myFormData_cv.append('code', this.product_image.name);

    this.http.post(environment.utilityApiBasePath + 'upload-product', myFormData_cv, {
      headers: headers_cv, reportProgress: true,
      observe: 'events'
    }).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.percentage = Math.round(100 * event.loaded / event.total) + '%';
      } else if (event instanceof HttpResponse) {
        console.log('File uploaded successfully!' + JSON.stringify(event));
        this.loadedImage=true;
        this.product_image = null;
        this.percentage = Math.round(100 * 0) + '%';
      }

    }, error => {


      this.toastr.error('Error while fetching data!', 'Error.');

    });

  }
  
  handleImages(l: FileList, event1: any): void {
    this.file_store1 = l;
    this.isSuccess = false;
    var file_name = '';

    if (l.length) {
      const f = l[0];
      const count = l.length > 1 ? `(+${l.length - 1} files)` : "";
      // this.display_memo.patchValue(`${f.name}${count}`);
      
      var date = new Date();
      var components = [
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      ];

      var name = `${f.name}${count}`;
      file_name = components.join("") + "_" + name;

      this.display_image.patchValue(file_name.toString());

      this.images = event1.target.files[0];

    } else {
      this.display_image.patchValue("");
    }

    const myFormData_cv = new FormData();
    const headers_aud = new HttpHeaders();
    headers_aud.append('Content- Type', 'multipart/form-data');
    headers_aud.append('Accept', 'application/json');
    myFormData_cv.append('imgPath', this.images);
    myFormData_cv.append('code', file_name.toString().replace(/ /g, "_"));

    this.http.post(environment.utilityApiBasePath + 'upload-product-color-image', myFormData_cv, {
      headers: headers_aud, reportProgress: true,
      observe: 'events'
    }).subscribe((event:any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.percentage1 = Math.round(100 * event.loaded / event.total) + '';
      } else if (event instanceof HttpResponse) {
        console.log('File uploaded successfully!' + JSON.stringify(event));
        this.addImage(file_name.toString().replace(/ /g, "_"));
        this.isSuccess = true;

        this.display_image.setValue(null);
        this.images = null;
        this.percentage1 = Math.round(100 * 0) + '%';
      }

    }, error => {

      console.log(error);
    });
  }
  addImage(name: string) {
    let rows = this.addProductForm.get('images') as FormArray;

    rows.push(this.formBuilder.group({
      imgPath: [name],
      color:['#2889e9']
    }));
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
  checkValueNew(e: any) {
    if (e.target.checked === true) {
      this.isCheckedNew = 'Y';
      this.checkedNew = true;
    } else {
      this.isCheckedNew = 'N';
      this.checkedNew = false;
    }
  }

  onSubmit() {
    this.dataSaved = false;
    this.saveOrUpdate();
    // this.addProductForm.reset();
  }
  convertToDecimal(inputValue: string) {
    const inputNumber = parseInt(inputValue.replace(/\D/g, ''), 10);
    let decimalValue: string;

    if (isNaN(inputNumber)) {
      decimalValue = '0.00';
    } else {
      const integerPart = Math.floor(inputNumber / 100);
      const decimalPart = inputNumber % 100;
      decimalValue = `${integerPart}.${decimalPart.toString().padStart(2, '0')}`;
    }

    this.priceInput.nativeElement.value = decimalValue;
    this.addProductForm.get('price').setValue(decimalValue);
  }
  convertToDecimal1(inputValue: string) {
    const inputNumber = parseInt(inputValue.replace(/\D/g, ''), 10);
    let decimalValue: string;

    if (isNaN(inputNumber)) {
      decimalValue = '0.00';
    } else {
      const integerPart = Math.floor(inputNumber / 100);
      const decimalPart = inputNumber % 100;
      decimalValue = `${integerPart}.${decimalPart.toString().padStart(2, '0')}`;
    }

    this.discountRInput.nativeElement.value = decimalValue;
    this.addProductForm.get('discountRate').setValue(decimalValue);
  }
  convertToDecimal2(inputValue: string) {
    const inputNumber = parseInt(inputValue.replace(/\D/g, ''), 10);
    let decimalValue: string;

    if (isNaN(inputNumber)) {
      decimalValue = '0.00';
    } else {
      const integerPart = Math.floor(inputNumber / 100);
      const decimalPart = inputNumber % 100;
      decimalValue = `${integerPart}.${decimalPart.toString().padStart(2, '0')}`;
    }

    this.discountAInput.nativeElement.value = decimalValue;
    this.addProductForm.get('discountAmount').setValue(decimalValue);
  }
  convertToDecimal3(inputValue: string) {
    const inputNumber = parseInt(inputValue.replace(/\D/g, ''), 10);
    let decimalValue: string;

    if (isNaN(inputNumber)) {
      decimalValue = '0.00';
    } else {
      const integerPart = Math.floor(inputNumber / 100);
      const decimalPart = inputNumber % 100;
      decimalValue = `${integerPart}.${decimalPart.toString().padStart(2, '0')}`;
    }

    this.vatRInput.nativeElement.value = decimalValue;
    this.addProductForm.get('vatRate').setValue(decimalValue);
  }
  convertToDecimal4(inputValue: string) {
    const inputNumber = parseInt(inputValue.replace(/\D/g, ''), 10);
    let decimalValue: string;

    if (isNaN(inputNumber)) {
      decimalValue = '0.00';
    } else {
      const integerPart = Math.floor(inputNumber / 100);
      const decimalPart = inputNumber % 100;
      decimalValue = `${integerPart}.${decimalPart.toString().padStart(2, '0')}`;
    }

    this.vatAInput.nativeElement.value = decimalValue;
    this.addProductForm.get('vatAmount').setValue(decimalValue);
  }
  loadAllMainCategory() {
    this.service.Get('select-maincategory').subscribe(
      (success: any) => {
        this.allMainCategory = success;
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }
  loadAllBrand() {
    this.service.Get('select-brand').subscribe(
      (success: any) => {
        this.allbrand = success;
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }
  
  loadAllsubCategory() {
    this.service.Get('select-subcategory').subscribe(
      (success: any) => {
        this.allsubCategory = success;
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }
  loadAllscale() {
    this.service.Get('select-scale').subscribe(
      (success: any) => {
        this.allscale = success;
      },
      error => {
        this.toastr.error('Error while fetching data!', 'Error.');


      });
  }

  saveOrUpdate() {

    this.product.nameOf = this.addProductForm.get('nameOf').value;
    this.product.description = this.addProductForm.get('description').value;
    this.product.isActive = this.isChecked;
    this.product.isNew = this.isCheckedNew;
    this.product.mainCategory_id = this.addProductForm.get('mainCategory_id').value;
    this.product.subCategory_id = this.addProductForm.get('subCategory_id').value;
    this.product.scale_id = this.addProductForm.get('scale_id').value;
    this.product.brand_id = this.addProductForm.get('brand_id').value;
    this.product.price = this.addProductForm.get('price').value;
    this.product.sku = 0;
    this.product.discountRate = this.addProductForm.get('discountRate').value ? this.addProductForm.get('discountRate').value : 0;
    this.product.discountAmount = this.addProductForm.get('discountAmount').value ? this.addProductForm.get('discountAmount').value : 0;
    this.product.vatRate = this.addProductForm.get('vatRate').value ? this.addProductForm.get('vatRate').value : 0;
    this.product.vatAmount = this.addProductForm.get('vatAmount').value ? this.addProductForm.get('vatAmount').value : 0;

    this.product.imgPath = this.product_profile.value ? this.product_profile.value : '-';

    if ( this.isEdit==false) {
      this.service.Post('product', this.product).subscribe(
        (item:any) => {
          var product_id = item.data.custId;
          this.dataSaved = true;
          
          let images = this.addProductForm.get('images') as FormArray;
          var images_data = images.value;
          for (let a = 0; a < images.length; a++) {
            var image:any = {};
            image.product_id = product_id;
            image.imgPath = images_data[a]['imgPath'];
            image.color = (document.getElementById(a.toString()) as HTMLInputElement).value;

            this.http.post(environment.utilityApiBasePath+'product-image', image).subscribe(
              aud => {
              }
            )
          }
          // success
         setTimeout(() => {
          this.toastr.success('New Product Created!', 'OK!');
          this.productIdToUpdate = null;
          this.clearLocal();
         }, 2000);
        },
        err => {

          this.toastr.error('Error while fetching data!', 'Error.');
        }
      );
    } else {
      this.product.custId = this.particularProduct[0].custId;

      this.service.Update('product', this.product, this.particularProduct[0].custId).subscribe(
        () => {
          this.dataSaved = true;
          this.service.GetById('delete-image', this.particularProduct[0].custId).subscribe(
            () => {
              let images = this.addProductForm.get('images') as FormArray;
              var images_data = images.value;
              for (let a = 0; a < images.length; a++) {
                var image:any = {};
                image.product_id = this.particularProduct[0].custId;
                image.imgPath = images_data[a]['imgPath'];
                image.color = (document.getElementById(a.toString()) as HTMLInputElement).value;
    
                this.http.post(environment.utilityApiBasePath+'product-image', image).subscribe(
                  aud => {
                  }
                )
              }
            },
            err => {
              this.toastr.error('Error while fetching data!', 'Eroor');
            }
          );
          // success
          setTimeout(() => {
            this.toastr.success(' Product Updated!', 'OK!');
            this.productIdToUpdate = null;
            this.clearLocal();
           }, 2000);
        },
        err => {
          this.toastr.error('Error while fetching data!', 'Error');
        }
      );
    }
  }

  clearLocal() {
    
    let image = this.addProductForm.get('images') as FormArray;
    image.controls = [];
    this.product_profile.patchValue(null);
    this.addProductForm.reset();
    this.isChecked = 'Y';
    this.checked = true;
    this.isCheckedNew = 'Y';
    this.checkedNew = true;
    this.productImageSrc = "./assets/images/noImage.jpg";
  }
  removeImage(){
    this.productImageSrc="./assets/images/noImage.jpg";

    // alert('');
  }
  removeImage1(){
    this.loadedImage=false;
    this.product_profile.patchValue("");
    this.productImageSrc="./assets/images/noImage.jpg";

    // alert('');
  }
}
