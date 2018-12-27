import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelServicesDialogComponent } from './travel-services-dialog.component';

describe('TravelServicesDialogComponent', () => {
  let component: TravelServicesDialogComponent;
  let fixture: ComponentFixture<TravelServicesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelServicesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelServicesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
