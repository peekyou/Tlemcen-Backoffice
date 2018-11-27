import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelRoomsDialogComponent } from './hotel-rooms-dialog.component';

describe('HotelRoomsDialogComponent', () => {
  let component: HotelRoomsDialogComponent;
  let fixture: ComponentFixture<HotelRoomsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelRoomsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelRoomsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
