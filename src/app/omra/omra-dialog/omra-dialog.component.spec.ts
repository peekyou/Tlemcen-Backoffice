import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmraDialogComponent } from './omra-dialog.component';

describe('OmraDialogComponent', () => {
  let component: OmraDialogComponent;
  let fixture: ComponentFixture<OmraDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmraDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
