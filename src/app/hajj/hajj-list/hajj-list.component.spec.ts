import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HajjListComponent } from './hajj-list.component';

describe('HajjListComponent', () => {
  let component: HajjListComponent;
  let fixture: ComponentFixture<HajjListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HajjListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HajjListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
