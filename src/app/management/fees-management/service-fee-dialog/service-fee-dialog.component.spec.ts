import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceFeeDialogComponent } from './service-fee-dialog.component';

describe('ServiceFeeDialogComponent', () => {
  let component: ServiceFeeDialogComponent;
  let fixture: ComponentFixture<ServiceFeeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceFeeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceFeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
