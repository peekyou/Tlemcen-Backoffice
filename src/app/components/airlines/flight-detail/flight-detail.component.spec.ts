import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsAssignmentComponent } from './flights-assignment.component';

describe('FlightsAssignmentComponent', () => {
  let component: FlightsAssignmentComponent;
  let fixture: ComponentFixture<FlightsAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightsAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightsAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
