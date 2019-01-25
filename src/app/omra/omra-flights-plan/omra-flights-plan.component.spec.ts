import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmraFlightsPlanComponent } from './omra-flights-plan.component';

describe('OmraFlightsPlanComponent', () => {
  let component: OmraFlightsPlanComponent;
  let fixture: ComponentFixture<OmraFlightsPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmraFlightsPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmraFlightsPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
