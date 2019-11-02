import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsPreviewComponent } from './sms-preview.component';

describe('SmsPreviewComponent', () => {
  let component: SmsPreviewComponent;
  let fixture: ComponentFixture<SmsPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
