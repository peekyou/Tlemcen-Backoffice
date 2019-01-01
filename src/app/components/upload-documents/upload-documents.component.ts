import { Component, OnInit, Inject, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppDocument } from '../../management/documents-management/document.model';
import { AppFile } from '../../core/models/file.model';
import { DocumentService } from '../../management/documents-management/document.service';
import { CustomerDetail } from '../../customers/customer-detail.model';
import { CustomersService } from '../../customers/customers.service';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss']
})
export class UploadDocumentsComponent implements OnInit {
  loader: Subscription;
  documentsConfigured: AppDocument[];
  _customer: CustomerDetail = {};
  
  @Input() travelTypeId: string;
  
  @Input() 
  set customer(customer: CustomerDetail) {
    this._customer = customer;
    if (this.documentsConfigured) {
      this.resetDocuments();
      this.getCustomerDocuments();
    }
  }
  get customer(): CustomerDetail {
    return this._customer;
  }

  constructor(private documentService: DocumentService, private customerService: CustomersService) {
  }

  ngOnInit() {
    if (this.travelTypeId) {
      this.loader = this.documentService.getDocumentsByCategory(this.travelTypeId)
        .subscribe(res => {
          this.documentsConfigured = JSON.parse(JSON.stringify(res));
          this.getCustomerDocuments();
        });
    }
  }

  getCustomerDocuments() {
    if (this._customer && this._customer.documents) {
      this._customer.documents.forEach(x => {
        if (x.id) {
          var document = this.documentsConfigured.find(d => d.id == x.documentTypeId);
          this.customerService.getCustomerDocument(this._customer.id, x.documentTypeId)
            .subscribe(doc => {
              if (!document.file) {
                document.file = new AppFile();
              }
              document.file.data = doc;
            });
        }
      });
    }
  }

  uploadDocument(file, customer, document) {
    this.customerService
        .uploadCustomerDocument(customer.id, document.id, file)
        .subscribe(
            r => { },
            err => { console.log(err); }
        );
  }

  resetDocuments() {
    this.documentsConfigured.forEach(x => {
      x.file = null;
    })
  }
}
