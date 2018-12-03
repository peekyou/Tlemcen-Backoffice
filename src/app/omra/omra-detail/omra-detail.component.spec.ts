import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmraDetailComponent } from './omra-detail.component';

describe('OmraDetailComponent', () => {
  let component: OmraDetailComponent;
  let fixture: ComponentFixture<OmraDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmraDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmraDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
