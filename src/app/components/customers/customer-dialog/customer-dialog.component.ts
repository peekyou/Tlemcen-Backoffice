import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// import { UploadDocumentsDialogComponent } from '../../upload-documents-dialog/upload-documents-dialog.component';

@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.scss']
})
export class CustomerDialogComponent implements OnInit {
  success = true;
  @Input() showDocuments = false;
  
  constructor(
    public dialogRef: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  onSubmit(customer) {
      this.close(customer)
  }

  close(customer = null): void {
      this.dialogRef.close(customer);
  }
}
