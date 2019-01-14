import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsPackDialogComponent } from './sms-pack-dialog.component';

describe('SmsPackDialogComponent', () => {
  let component: SmsPackDialogComponent;
  let fixture: ComponentFixture<SmsPackDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsPackDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsPackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
