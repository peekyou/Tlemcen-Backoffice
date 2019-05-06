import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmraGroupsManagementComponent } from './omra-groups-management.component';

describe('OmraGroupsManagementComponent', () => {
  let component: OmraGroupsManagementComponent;
  let fixture: ComponentFixture<OmraGroupsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmraGroupsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmraGroupsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
