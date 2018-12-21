import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ToasterService } from '../../../core/services/toaster.service';
import { Customer } from '../../../customers/customer.model';
import { CustomersService } from '../../../customers/customers.service';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import { removeFromArray } from '../../../core/helpers/utils';
import { PagingResponse } from '../../../core/models/paging';

import { UploadDocumentsDialogComponent } from '../../upload-documents-dialog/upload-documents-dialog.component';

@Component({
  selector: 'app-search-customer-dialog',
  templateUrl: './search-customer-dialog.component.html',
  styleUrls: ['./search-customer-dialog.component.scss']
})
export class SearchCustomerDialogComponent implements OnInit {
  customers: PagingResponse<Customer>;
  customersChecked: Customer[];

  @Output() onCustomersAdded: EventEmitter<Customer[]> = new EventEmitter();
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<SearchCustomerDialogComponent>,
    public toasterService: ToasterService,
    private service: CustomersService) {
      
      service.getCustomers()
        .subscribe(res => this.customers = res);
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
        this.toasterService.showToaster('Client ajouté');
      }
      // else {
      //   this.showMessage('Erreur lors de l\'ajout du client', false);
      // }
    });
  }
  
  close(customer = null): void {
    this.dialogRef.close(customer);
  }
}
