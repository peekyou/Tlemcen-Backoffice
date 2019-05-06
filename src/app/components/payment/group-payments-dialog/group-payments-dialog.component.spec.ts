import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPaymentsComponent } from './group-payments.component';

describe('GroupPaymentsComponent', () => {
  let component: GroupPaymentsComponent;
  let fixture: ComponentFixture<GroupPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
