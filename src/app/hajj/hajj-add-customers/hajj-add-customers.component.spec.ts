import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HajjAddCustomersComponent } from './hajj-add-customers.component';

describe('HajjAddCustomersComponent', () => {
  let component: HajjAddCustomersComponent;
  let fixture: ComponentFixture<HajjAddCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HajjAddCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HajjAddCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
