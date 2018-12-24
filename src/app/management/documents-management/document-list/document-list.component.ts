import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { DocumentDialogComponent } from '../document-dialog/document-dialog.component';
import { DeleteDialogComponent } from '../../../components/common/delete-dialog/delete-dialog.component';
import { DocumentService } from '../document.service';
import { AppDocument } from '../document.model';
import { PagingResponse } from '../../../core/models/paging';
import { TravelType } from '../../../travels/travel.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  loader: Subscription;
  currentPage: number = 1;
  itemsPerPage: number = 20;
  documents: PagingResponse<AppDocument>;

  constructor(private dialog: MatDialog, private service: DocumentService) {
      this.getDocuments();
  }

  ngOnInit() {
  }

  getDocuments() {
    window.scroll(0,0);

    this.loader = this.service.getDocuments(this.currentPage, this.itemsPerPage)
    .subscribe(
      res => this.documents = res,
      err => console.log(err)
    );
  }

  pageChanged(page) {
    this.currentPage = page;
    this.getDocuments();
  }

  openDocumentDialog(document: AppDocument = null) {
    let dialogRef = this.dialog.open(DocumentDialogComponent, {
      autoFocus: true,
      width: '534px'
    });

    dialogRef.afterClosed().subscribe(newDocument => {
      if (newDocument) {
        this.currentPage = 1;
        this.getDocuments();
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
        this.service.deleteDocument(document.id)
        .subscribe(
          res => {
            var index = this.documents.data.indexOf(document);
            if (index > -1) {
                this.documents.data.splice(index, 1);
                this.documents.paging.totalCount--;
            }
          },
          err => console.log(err)
        );
      }
    });
  }

  displayCategories(document: AppDocument) {
    var display = '';
    if (document && document.categories) {
      for(let i = 0; i < document.categories.length; i++) {
        var category = document.categories[i];
        if (category == TravelType.Hajj) {
          display += 'Hajj, ';
        }
        else if (category == TravelType.Omra) {
          display += 'Omra, ';
        }
        else if (category == TravelType.Travel) {
          display += 'Voyage, ';
        }
      }
      return display.slice(0, -2);
    }
    return display;
  }
}
