import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDocumentsDialogComponent } from './print-documents-dialog.component';

describe('PrintDocumentsDialogComponent', () => {
  let component: PrintDocumentsDialogComponent;
  let fixture: ComponentFixture<PrintDocumentsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintDocumentsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDocumentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
