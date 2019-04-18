import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBookingDialogComponent } from './hotel-booking-dialog.component';

describe('HotelBookingDialogComponent', () => {
  let component: HotelBookingDialogComponent;
  let fixture: ComponentFixture<HotelBookingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelBookingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelBookingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
