import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HajjGroupsManagementComponent } from './hajj-groups-management.component';

describe('HajjGroupsManagementComponent', () => {
  let component: HajjGroupsManagementComponent;
  let fixture: ComponentFixture<HajjGroupsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HajjGroupsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HajjGroupsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
