import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { TravelService } from '../../../travels/travel.service';
import { CustomerTravel } from '../../../customers/customer-travel.model';

@Component({
  selector: 'app-print-documents-dialog',
  templateUrl: './print-documents-dialog.component.html',
  styleUrls: ['./print-documents-dialog.component.scss']
})
export class PrintDocumentsDialogComponent implements OnInit {
  customerTravel: CustomerTravel;

  constructor(
    private service: TravelService,
    public dialogRef: MatDialogRef<PrintDocumentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) { 
      if (data && data.customerTravel) {
        this.customerTravel = data.customerTravel
      }
    }

  ngOnInit() {
  }

  printContract() {
    this.service.downloadTravelerContract(this.customerTravel.travel.id, this.customerTravel.customer.id)
    .subscribe(res => {});
  }

  printPaymentReceipt() {
    this.service.downloadPaymentReceipt(this.customerTravel.travel.id, this.customerTravel.customer.id)
    .subscribe(res => {});
  }

  printTravelerBadge() {
    this.service.downloadTravelerBadge(this.customerTravel.travel.id, this.customerTravel.customer.id)
    .subscribe(res => {});
  }

  printInhumationAuthorization() {
    this.service.downloadInhumationAuthorization(this.customerTravel.travel.id, this.customerTravel.customer.id)
    .subscribe(res => {});
  }

  close() {
    this.dialogRef.close();
  }
}
