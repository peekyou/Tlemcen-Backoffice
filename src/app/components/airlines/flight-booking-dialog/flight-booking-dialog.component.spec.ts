import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightBookingDialogComponent } from './flight-booking-dialog.component';

describe('FlightBookingDialogComponent', () => {
  let component: FlightBookingDialogComponent;
  let fixture: ComponentFixture<FlightBookingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightBookingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightBookingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
