import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentsDialogComponent } from './upload-documents-dialog.component';

describe('UploadDocumentsDialogComponent', () => {
  let component: UploadDocumentsDialogComponent;
  let fixture: ComponentFixture<UploadDocumentsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDocumentsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocumentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
