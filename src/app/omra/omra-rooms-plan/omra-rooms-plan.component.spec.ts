import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmraRoomsPlanComponent } from './omra-rooms-plan.component';

describe('OmraRoomsPlanComponent', () => {
  let component: OmraRoomsPlanComponent;
  let fixture: ComponentFixture<OmraRoomsPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmraRoomsPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmraRoomsPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
