import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { PagingResponse } from '../../core/models/paging';
import { Omra } from '../omra.model';
import { OmraService } from '../omra.service';
import { OmraDialogComponent } from '../omra-dialog/omra-dialog.component';

@Component({
  selector: 'app-omra-list',
  templateUrl: './omra-list.component.html',
  styleUrls: ['./omra-list.component.scss']
})
export class OmraListComponent implements OnInit {
  loader: Subscription;
  currentPage: number = 1;
  itemsPerPage: number = 20;
  omraList: PagingResponse<Omra>;
  
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private service: OmraService) {
      this.getOmraList();
  }

  ngOnInit() {
  }

  getOmraList() {
    window.scroll(0,0);

    this.loader = this.service.getOmraList(this.currentPage, this.itemsPerPage)
    .subscribe(
      res => this.omraList = res,
      err => console.log(err)
    );
  }

  pageChanged(page) {
    this.currentPage = page;
    this.getOmraList();
  }

  newOmra() {
    let dialogRef = this.dialog.open(OmraDialogComponent, {
      autoFocus: true,
      width: '534px'
    });

    dialogRef.afterClosed().subscribe(newOmra => {
      if (newOmra) {
        this.router.navigate(['/omra', newOmra.id]);
      }
    });
  }
}
