import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Customer } from '../../../customers/customer.model';
import { CustomersService } from '../../../customers/customers.service';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import { removeFromArray } from '../../../core/helpers/utils';

import { UploadDocumentsDialogComponent } from '../../upload-documents-dialog/upload-documents-dialog.component';

@Component({
  selector: 'app-search-customer-dialog',
  templateUrl: './search-customer-dialog.component.html',
  styleUrls: ['./search-customer-dialog.component.scss']
})
export class SearchCustomerDialogComponent implements OnInit {
  customers: Customer[];
  customersChecked: Customer[] = [];

  @Output() onCustomersAdded: EventEmitter<Customer[]> = new EventEmitter();
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<SearchCustomerDialogComponent>,
    public snackBar: MatSnackBar,
    private service: CustomersService) {
      
      this.customers = service.customers;
  }

  ngOnInit() {
  }

  customerChecked($event, customer: Customer) {
    if ($event.checked) {
      this.customersChecked.push(customer);
    }
    else {
      this.customersChecked = removeFromArray(this.customersChecked, customer);
    }
  }

  newCustomer() {
    let dialogRef = this.dialog.open(CustomerDialogComponent, {
        autoFocus: false,
        width: '534px'
    });

    dialogRef.afterClosed().subscribe(customers => {
      if (customers && customers.length > 0) {
        this.onCustomersAdded.emit(customers);
      }
    });
  }

  addExisting(customer = null) {
  	var selected: Customer[] = customer ? [customer] : this.customersChecked;
    let dialogRef = this.dialog.open(UploadDocumentsDialogComponent, {
      autoFocus: false,
      width: '534px',
      data: {
        customers: selected
      }
    });

    dialogRef.afterClosed().subscribe(customers => {
      if (customers && customers.length > 0) {
        this.onCustomersAdded.emit(customers);
        this.showMessage('Client ajouté');
      }
      else {
        this.showMessage('Erreur lors de l\'ajout du client');
      }
    });
  }
  
  close(customer = null): void {
    this.dialogRef.close(customer);
  }

  showMessage(message: string, success: boolean = true) {
    var bgColor = success ? 'bg-success' : 'bg-danger';
    this.snackBar.open(message, '×', {
      duration: 200000,
      panelClass: [bgColor, 'text-white']
    });
  }
}
