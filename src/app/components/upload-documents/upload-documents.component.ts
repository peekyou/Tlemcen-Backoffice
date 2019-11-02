import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';

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
  @Input() travelId: string;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  
  @Input() 
  set customer(customer: CustomerDetail) {
    this._customer = customer;
    this.resetDocuments();
    this.getDocuments();
  }
  get customer(): CustomerDetail {
    return this._customer;
  }

  constructor(private documentService: DocumentService, private customerService: CustomersService) {
  }

  ngOnInit() {
  }

  getDocuments() {
    if (this.travelTypeId) {
      this.loader = this.documentService.getCustomerDocumentsByCategory(this.travelTypeId, this._customer.id)
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
  
  documentChecked(event, document: AppDocument) {
    var found = this._customer.documents.find(x => x.documentTypeId == document.id);
    if (found == null) {
      this._customer.documents.push({
        documentTypeId: document.id,
        received: event.checked,
        travelId: this.travelId
      });
    }
    else {
      found.received = event.checked;
    }

    this.emitChanges();
  }
  
  emitChanges() {
    this.onChange.emit(this._customer.documents);
  }

  uploadDocument(file, customer, document) {
    this.customerService
        .uploadCustomerDocument(this.travelId, customer.id, document.id, file)
        .subscribe(
            r => { },
            err => { console.log(err); }
        );
  }

  isDocumentReceived(document: AppDocument) {
    if (this._customer.documents) {
      var customerDoc = this._customer.documents.find(x => x.documentTypeId == document.id);
      return customerDoc && customerDoc.received;
    }
    return false;
  }

  resetDocuments() {
    if (this.documentsConfigured) {
      this.documentsConfigured.forEach(x => {
        x.file = null;
      });
    }
  }
}
