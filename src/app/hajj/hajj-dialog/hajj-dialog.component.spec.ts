import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HajjDialogComponent } from './hajj-dialog.component';

describe('HajjDialogComponent', () => {
  let component: HajjDialogComponent;
  let fixture: ComponentFixture<HajjDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HajjDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HajjDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
