import { Component, OnInit, Inject, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppDocument } from '../../management/documents-management/document.model';
import { DocumentService } from '../../management/documents-management/document.service';
import { Customer } from '../../customers/customer.model';
import { CustomersService } from '../../customers/customers.service';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss']
})
export class UploadDocumentsComponent implements OnInit {
  @Input() customer: Customer;
  @Input() travel;

  constructor(private documentService: DocumentService, private customerService: CustomersService) {
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
}
