import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DocumentDialogComponent } from '../document-dialog/document-dialog.component';
import { DeleteDialogComponent } from '../../../components/common/delete-dialog/delete-dialog.component';
import { DocumentService } from '../document.service';
import { AppDocument } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  documents: AppDocument[];

  constructor(
    private dialog: MatDialog,
    private service: DocumentService) { 
    this.documents = service.documents;
  }

  ngOnInit() {
  }

  openDocumentDialog(document: AppDocument = null) {
    let dialogRef = this.dialog.open(DocumentDialogComponent, {
      autoFocus: false,
      width: '534px'
    });

    dialogRef.afterClosed().subscribe(newDocument => {
      if (!this.documents) {
        this.documents = [];
      }

      if (newDocument) {
        this.documents.push(newDocument);
      }
    });
  }

  openDeleteDialog(document: AppDocument) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { name: document.name }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.delete(document.id)
        .subscribe(
          res => this.documents = this.service.documents,
          err => console.log(err)
        );
      }
    });
  }
}
