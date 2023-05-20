import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ColorPickerService } from 'ngx-color-picker';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})
export class EditOrderComponent implements OnInit {

  billId:any;
  sale: any = {};
  isEdit: boolean = false;
  editOrderForm:any;
  breifidIdToUpdate = null;

  constructor(private cpService: ColorPickerService,public formBuilder: FormBuilder, private toastr: ToastrService,
    private message: ConfirmationDialogService, private http: HttpClient, private service: AuthService, private router: Router, private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.editOrderForm = this.formBuilder.group({
      mobileNum: ['', [Validators.required]],
      shippingAdd1:['', [Validators.required]],
      shippingAdd2:['', [Validators.required]],
      shippingCity:['', [Validators.required]],
      shippingPostcode:['', [Validators.required]],
      shippingCountry:['', [Validators.required]],
      billingAdd1:['', [Validators.required]],
      billingAdd2:['', [Validators.required]],
      billingCity:['', [Validators.required]],
      billingPostcode:['', [Validators.required]],
      billingCountry:['', [Validators.required]],
      status:['',[Validators.required]],
      paymentStatus:['',[Validators.required]]
    });
    this.route.params.subscribe(data => {
      this.billId = data['billId'];
      if (this.billId != undefined) {
       
          this.isEdit = true;
          this.loadAllOrderById();
        }
        else {
          this.isEdit = false;
        }
      

    });
  }
  loadAllOrderById(){
    this.service.GetById('sale-brief', this.billId).subscribe(
      (item: any) => {
        this.breifidIdToUpdate = item.billId;
        this.editOrderForm.controls['mobileNum'].setValue(item.mobileNum);
        this.editOrderForm.controls['shippingAdd1'].setValue(item.shippingAdd1);
        this.editOrderForm.controls['shippingAdd2'].setValue(item.shippingAdd2);
        this.editOrderForm.controls['shippingCity'].setValue(item.shippingCity);
        this.editOrderForm.controls['shippingPostcode'].setValue(item.shippingPostcode);
        this.editOrderForm.controls['shippingCountry'].setValue(item.shippingCountry);
        this.editOrderForm.controls['billingAdd1'].setValue(item.billingAdd1);
        this.editOrderForm.controls['billingAdd2'].setValue(item.billingAdd2);
        this.editOrderForm.controls['billingCity'].setValue(item.billingCity);
        this.editOrderForm.controls['billingPostcode'].setValue(item.billingPostcode);
        this.editOrderForm.controls['billingCountry'].setValue(item.billingCountry);  
        this.editOrderForm.controls['status'].setValue(item.status);  
        this.editOrderForm.controls['paymentStatus'].setValue(item.paymentStatus);  

       },
      err => {
        console.log(err);
      }
    );
  }
  onSubmit(){
    this.sale.billId = this.breifidIdToUpdate;
    this.sale.mobileNum = this.editOrderForm.get('mobileNum').value;
    this.sale.shippingAdd1 = this.editOrderForm.get('shippingAdd1').value;
    this.sale.shippingAdd2 = this.editOrderForm.get('shippingAdd2').value;
    this.sale.shippingCity = this.editOrderForm.get('shippingCity').value;
    this.sale.shippingPostcode = this.editOrderForm.get('shippingPostcode').value;
    this.sale.shippingCountry = this.editOrderForm.get('shippingCountry').value;
    this.sale.billingAdd1 = this.editOrderForm.get('billingAdd1').value;
    this.sale.billingAdd2 = this.editOrderForm.get('billingAdd2').value;
    this.sale.billingCity = this.editOrderForm.get('billingCity').value;
    this.sale.billingPostcode = this.editOrderForm.get('billingPostcode').value;
    this.sale.billingCountry = this.editOrderForm.get('billingCountry').value;
    this.sale.status = this.editOrderForm.get('status').value;
    this.sale.paymentStatus = this.editOrderForm.get('paymentStatus').value;

    this.service.Update('sale-brief', this.sale, this.breifidIdToUpdate).subscribe(
      () => {
        this.toastr.success('Sale Brief Info Updated!', 'Ok!');
        this.router.navigate(['/customer/order']);
      },
      err => {
        this.toastr.error('Error while fetching data!', 'Error');
      }
    );
  }

}
