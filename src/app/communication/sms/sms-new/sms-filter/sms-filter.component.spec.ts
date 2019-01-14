import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsFilterComponent } from './sms-filter.component';

describe('SmsFilterComponent', () => {
  let component: SmsFilterComponent;
  let fixture: ComponentFixture<SmsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
