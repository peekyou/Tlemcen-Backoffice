import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { UploadDocumentsDialogComponent } from '../../upload-documents-dialog/upload-documents-dialog.component';

@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.scss']
})
export class CustomerDialogComponent implements OnInit {
  success = true;
  
  constructor(
    public dialogRef: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  onSubmit(customer) {
    let dialogRef = this.dialog.open(UploadDocumentsDialogComponent, {
      autoFocus: false,
      width: '534px',
      data: {
        customers: [customer]
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
