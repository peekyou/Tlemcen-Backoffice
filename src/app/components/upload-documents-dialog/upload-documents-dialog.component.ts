import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Document} from '../../core/models/document.model';
import { Customer} from '../../customers/customer.model';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component'

@Component({
  selector: 'app-upload-documents-dialog',
  templateUrl: './upload-documents-dialog.component.html',
  styleUrls: ['./upload-documents-dialog.component.scss']
})
export class UploadDocumentsDialogComponent implements OnInit {
  customers: Customer[];
  loading: boolean;
  documents: Document[] = [
    { id: '1', name: 'Passeport', mandatory: true, file: null },
    { id: '2', name: 'Visa', mandatory: true, file: null },
    { id: '3', name: 'Assurance', mandatory: false, file: null },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UploadDocumentsDialogComponent>,
    private dialog: MatDialog) {
      if (data) {
        this.customers = data.customers;
        this.customers.forEach(c => c.documents = JSON.parse(JSON.stringify(this.documents)));
      }
    }

  ngOnInit() {
  }

  addDocument = (file, customer: any) => {
    // this.service
    //     .uploadFile(file, page.id)
    //     .subscribe(
    //         r => {
    //             file.id = r;
    //             page.pictures.push(file);
    //         },
    //         err => { console.log(err); }
    //     );
  }

  saveDocuments() {
    let dialogRef = this.dialog.open(PaymentDialogComponent, {
      autoFocus: false,
      width: '534px',
      data: {
        customers: this.customers
      }
    });

    dialogRef.afterClosed().subscribe(customers => {
      this.close(customers);
    });
  }

  close(customers = null): void {
    this.dialogRef.close(customers);
  }
}
