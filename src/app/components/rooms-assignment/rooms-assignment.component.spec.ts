import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsAssignmentComponent } from './rooms-assignment.component';

describe('RoomsAssignmentComponent', () => {
  let component: RoomsAssignmentComponent;
  let fixture: ComponentFixture<RoomsAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomsAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomsAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
