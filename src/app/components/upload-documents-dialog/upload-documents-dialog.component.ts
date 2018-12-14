import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AppDocument } from '../../management/documents-management/document.model';
import { DocumentService } from '../../management/documents-management/document.service';
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
  documents: AppDocument[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UploadDocumentsDialogComponent>,
    private dialog: MatDialog,
    private documentService: DocumentService) {
      
      this.documents = this.documentService.documents.filter(x => x.categories.indexOf('Hajj') != -1 || x.categories.indexOf('Omra') != -1);
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
