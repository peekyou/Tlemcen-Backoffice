import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HajjFlightsPlanComponent } from './hajj-flights-plan.component';

describe('HajjFlightsPlanComponent', () => {
  let component: HajjFlightsPlanComponent;
  let fixture: ComponentFixture<HajjFlightsPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HajjFlightsPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HajjFlightsPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
