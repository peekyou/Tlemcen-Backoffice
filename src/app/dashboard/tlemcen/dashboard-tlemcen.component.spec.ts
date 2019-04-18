import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTlemcenComponent } from './dashboard-tlemcen.component';

describe('DashboardTlemcenComponent', () => {
  let component: DashboardTlemcenComponent;
  let fixture: ComponentFixture<DashboardTlemcenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardTlemcenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTlemcenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
