import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HajjDetailComponent } from './hajj-detail.component';

describe('HajjDetailComponent', () => {
  let component: HajjDetailComponent;
  let fixture: ComponentFixture<HajjDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HajjDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HajjDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
