import { Component, OnInit } from '@angular/core';
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

  constructor(
    private service: DocumentService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DocumentDialogComponent>,
    private dialog: MatDialog) {
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
    var doc = new AppDocument();
    doc.name = this.form.value.name;
    doc.mandatory = this.form.value.mandatory == true;
    if (this.form.value.hajj == true) {
      doc.categories.push(TravelType.Hajj);
    }
    if (this.form.value.omra == true) {
      doc.categories.push(TravelType.Omra);
    }
    if (this.form.value.travel == true) {
      doc.categories.push(TravelType.Travel);
    }
    
    this.saveSubscription = this.service
        .createDocument(doc)
        .subscribe(
            res => {
                this.dialogRef.close(res);
            },
            err => console.log(err)
        );
  }
}
