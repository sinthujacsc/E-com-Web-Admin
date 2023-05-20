import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaincategoryComponent } from './maincategory.component';

describe('MaincategoryComponent', () => {
  let component: MaincategoryComponent;
  let fixture: ComponentFixture<MaincategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaincategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaincategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
