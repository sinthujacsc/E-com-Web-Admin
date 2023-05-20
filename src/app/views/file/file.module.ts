// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
// Components Routing
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { MaincategoryComponent } from './maincategory/maincategory.component';
import { FileRoutingModule } from './file-routing.module';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { ProductComponent } from './product/product.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { CustomerComponent } from './customer/customer.component';
import { ScaleComponent } from './scale/scale.component';
import { AddProductComponent } from './add-product/add-product.component';
import { BrandComponent } from './brand/brand.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { ColorPickerModule } from 'ngx-color-picker';
import { AngularEditorModule } from '@kolkov/angular-editor';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    NgxPaginationModule,
    FilterPipeModule,
    FileRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatInputModule,
    SelectDropDownModule,
    ColorPickerModule,
    AngularEditorModule
  ],
  declarations: [


    MaincategoryComponent,
    SubcategoryComponent,
    ProductComponent,
    CustomerComponent,
    ScaleComponent,
    AddProductComponent,
    BrandComponent
  ]
})
export class FileModule {

}