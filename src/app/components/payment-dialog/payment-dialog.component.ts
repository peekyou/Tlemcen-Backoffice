import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Customer} from '../../customers/customer.model';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {
  loading: boolean;
  customers: Customer[];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,    
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    private dialog: MatDialog) {

      this.customers = data.customers;
  }

  ngOnInit() {
  }

  pay() {
    this.dialogRef.close(this.customers);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
