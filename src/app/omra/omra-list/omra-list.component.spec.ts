import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmraListComponent } from './omra-list.component';

describe('OmraListComponent', () => {
  let component: OmraListComponent;
  let fixture: ComponentFixture<OmraListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmraListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmraListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
