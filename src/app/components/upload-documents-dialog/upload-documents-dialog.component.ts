import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { AppDocument } from '../../management/documents-management/document.model';
import { DocumentService } from '../../management/documents-management/document.service';
import { Customer } from '../../customers/customer.model';
import { CustomersService } from '../../customers/customers.service';
import { TravelServicesDialogComponent } from '../travel-services-dialog/travel-services-dialog.component';

@Component({
  selector: 'app-upload-documents-dialog',
  templateUrl: './upload-documents-dialog.component.html',
  styleUrls: ['./upload-documents-dialog.component.scss']
})
export class UploadDocumentsDialogComponent implements OnInit {
  customers: Customer[];
  loading: boolean;
  documents: AppDocument[];
  loader: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UploadDocumentsDialogComponent>,
    private dialog: MatDialog,
    private documentService: DocumentService,
    private customerService: CustomersService) {
      
      if (data) {
        this.customers = data.customers;
        this.loader = this.documentService.getDocumentsByCategory(data.travel.travelTypeId)
          .subscribe(res => {
            this.documents = res;
            this.customers.forEach(c => c.documents = JSON.parse(JSON.stringify(this.documents)));
          });
      }
    }

  ngOnInit() {
  }

  uploadDocument(file, customer, document) {
    this.customerService
        .uploadCustomerDocument(customer.id, document.id, file)
        .subscribe(
            r => { },
            err => { console.log(err); }
        );
  }

  saveDocuments() {
    let dialogRef = this.dialog.open(TravelServicesDialogComponent, {
      autoFocus: false,
      width: '534px',
      data: {
        customers: this.customers,
        travel: this.data.travel
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
