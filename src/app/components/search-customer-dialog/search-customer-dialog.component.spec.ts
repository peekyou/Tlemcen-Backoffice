import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCustomerDialogComponent } from './search-customer-dialog.component';

describe('SearchCustomerDialogComponent', () => {
  let component: SearchCustomerDialogComponent;
  let fixture: ComponentFixture<SearchCustomerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCustomerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCustomerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
