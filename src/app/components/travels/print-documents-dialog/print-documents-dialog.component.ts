import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { TravelService } from '../../../travels/travel.service';
import { Travel } from '../../../travels/travel.model';
import { CustomerDetail } from '../../../customers/customer-detail.model';
import { Customer } from '../../../customers/customer.model';

@Component({
  selector: 'app-print-documents-dialog',
  templateUrl: './print-documents-dialog.component.html',
  styleUrls: ['./print-documents-dialog.component.scss']
})
export class PrintDocumentsDialogComponent implements OnInit {
  customers: CustomerDetail[];
  travel: Travel;
  customersChecked: Customer[] = [];

  constructor(
    private service: TravelService,
    public dialogRef: MatDialogRef<PrintDocumentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) { 
      if (data) {
        this.travel = data.travel;
        this.customers = data.customers;
        this.customers.forEach(c => this.customersChecked.push(c));
      }
    }

  ngOnInit() {
  }

  onCustomerChecked($event, customer: Customer) {
    if ($event.checked) {
      this.customersChecked.push(customer);
    }
    else {
      this.customersChecked = this.customersChecked.filter(x => x.id != customer.id);
    }
  }

  isCustomerChecked(customer: Customer) {
    return this.customersChecked.find(x => x.id == customer.id) != null;
  }

  printContract() {
    this.service.downloadTravelerContract(this.travel.id, this.customersChecked.map(x => x.id))
    .subscribe(res => {});
  }

  printPaymentReceipt() {
    this.service.downloadPaymentReceipt(this.travel.id, this.customersChecked.map(x => x.id))
    .subscribe(res => {});
  }

  printTravelerBadge() {
    this.service.downloadTravelerBadge(this.travel.id, this.customersChecked.map(x => x.id))
    .subscribe(res => {});
  }

  printInhumationAuthorization() {
    this.service.downloadInhumationAuthorization(this.travel.id, this.customersChecked.map(x => x.id))
    .subscribe(res => {});
  }

  close() {
    this.dialogRef.close();
  }
}
