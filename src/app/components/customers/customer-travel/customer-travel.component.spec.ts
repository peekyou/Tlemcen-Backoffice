import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTravelDialogComponent } from './customer-travel-dialog.component';

describe('CustomerTravelDialogComponent', () => {
  let component: CustomerTravelDialogComponent;
  let fixture: ComponentFixture<CustomerTravelDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerTravelDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTravelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
