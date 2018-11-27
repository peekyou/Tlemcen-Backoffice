import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HajjNewComponent } from './hajj-new.component';

describe('HajjNewComponent', () => {
  let component: HajjNewComponent;
  let fixture: ComponentFixture<HajjNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HajjNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HajjNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
