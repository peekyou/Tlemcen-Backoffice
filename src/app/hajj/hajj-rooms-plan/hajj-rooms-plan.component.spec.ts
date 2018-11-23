import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HajjRoomsPlanComponent } from './hajj-rooms-plan.component';

describe('HajjRoomsPlanComponent', () => {
  let component: HajjRoomsPlanComponent;
  let fixture: ComponentFixture<HajjRoomsPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HajjRoomsPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HajjRoomsPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
