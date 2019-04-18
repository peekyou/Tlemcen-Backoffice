import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators,  FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription, Observable } from 'rxjs';

import { AppDocument } from '../document.model';
import { DocumentService } from '../document.service';
import { TravelType } from '../../../travels/travel.model';

@Component({
  selector: 'app-document-dialog',
  templateUrl: './document-dialog.component.html',
  styleUrls: ['./document-dialog.component.scss']
})
export class DocumentDialogComponent implements OnInit {
  form: FormGroup;
  document: AppDocument = new AppDocument();
  saveSubscription: Subscription;
  isEdit = false;

  constructor(
    private service: DocumentService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DocumentDialogComponent>,
    private dialog: MatDialog) {

      if (data && data.document) {
        this.document = data.document;
        this.isEdit = true;
      }
  }

  ngOnInit() {
    this.form = this.fb.group({
      hajj: this.fb.control(this.document.categories.indexOf(TravelType.Hajj) > -1),
      omra: this.fb.control(this.document.categories.indexOf(TravelType.Omra) > -1),
      travel: this.fb.control(this.document.categories.indexOf(TravelType.Travel) > -1),
      name: this.fb.control(this.document.name, Validators.required),
      mandatory: this.fb.control(this.document.mandatory)
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.document.name = this.form.value.name;
    this.document.mandatory = this.form.value.mandatory == true;
    this.document.categories = [];
    if (this.form.value.hajj == true) {
      this.document.categories.push(TravelType.Hajj);
    }
    if (this.form.value.omra == true) {
      this.document.categories.push(TravelType.Omra);
    }
    if (this.form.value.travel == true) {
      this.document.categories.push(TravelType.Travel);
    }
    
    this.saveSubscription = this.saveDocument()
      .subscribe(
        res => {
            this.dialogRef.close(res);
        },
        err => console.log(err)
      );
  }

  private saveDocument() : Observable<AppDocument> {
      return this.isEdit ? this.service.updateDocument(this.document) : this.service.createDocument(this.document);
  }
}
