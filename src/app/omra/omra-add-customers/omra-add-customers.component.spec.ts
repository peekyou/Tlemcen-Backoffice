import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmraAddCustomersComponent } from './omra-add-customers.component';

describe('OmraAddCustomersComponent', () => {
  let component: OmraAddCustomersComponent;
  let fixture: ComponentFixture<OmraAddCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmraAddCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmraAddCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
