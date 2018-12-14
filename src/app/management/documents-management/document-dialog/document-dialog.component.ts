import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators,  FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription, Observable } from 'rxjs';

import { AppDocument } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-dialog',
  templateUrl: './document-dialog.component.html',
  styleUrls: ['./document-dialog.component.scss']
})
export class DocumentDialogComponent implements OnInit {
  form: FormGroup;
  document: AppDocument = new AppDocument();
  saveSubscription: Subscription;

  constructor(
    private service: DocumentService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DocumentDialogComponent>,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      type: this.fb.control(this.document.categories ? this.document.categories : 'HAJJ', Validators.required),
      name: this.fb.control(this.document.name, Validators.required),
      mandatory: this.fb.control(this.document.mandatory)
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    var doc = new AppDocument();
    doc.name = this.form.value.name;
    doc.mandatory = this.form.value.mandatory;
    if (this.form.value.type == 'HAJJ') {
      doc.categories = ['Hajj'];
    }
    else if (this.form.value.type == 'OMRA') {
      doc.categories = ['Omra'];
    }
    else if (this.form.value.type == 'TRAVEL') {
      doc.categories = ['Voyage'];
    }
    
    this.saveSubscription = this.service
        .create(doc)
        .subscribe(
            res => {
                this.dialogRef.close(res);
            },
            err => console.log(err)
        );
  }
}
