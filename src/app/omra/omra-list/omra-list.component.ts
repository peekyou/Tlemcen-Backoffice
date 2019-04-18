import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { PagingResponse } from '../../core/models/paging';
import { Omra } from '../omra.model';
import { OmraService } from '../omra.service';
import { OmraDialogComponent } from '../omra-dialog/omra-dialog.component';
import { TravelStatus } from '../../travels/travel.model';

@Component({
  selector: 'app-omra-list',
  templateUrl: './omra-list.component.html',
  styleUrls: ['./omra-list.component.scss']
})
export class OmraListComponent implements OnInit {
  loader: Subscription;
  currentPage: number = 1;
  itemsPerPage: number = 20;
  currentOmra: Omra[];
  completedOmra: PagingResponse<Omra>;
  
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private service: OmraService) {

      this.getCurrentOmra();
      this.getCompletedOmra();
  }

  ngOnInit() {
  }

  getCurrentOmra() {
    this.loader = this.service.getOmraList(TravelStatus.NotCompleted, null, null)
    .subscribe(
      res => this.currentOmra = res.data,
      err => console.log(err)
    );
  }

  getCompletedOmra() {
    window.scroll(0,0);

    this.service.getOmraList(TravelStatus.Completed, this.currentPage, this.itemsPerPage)
    .subscribe(
      res => this.completedOmra = res,
      err => console.log(err)
    );
  }

  pageChanged(page) {
    this.currentPage = page;
    this.getCompletedOmra();
  }

  openOmraDialog(omra: Omra = null) {
    let dialogRef = this.dialog.open(OmraDialogComponent, {
      autoFocus: true,
      width: '634px',
      data: {
        omra: omra
      }
    });

    dialogRef.afterClosed().subscribe(newOmra => {
      if (newOmra && newOmra.id) {
        this.router.navigate(['/omra', newOmra.id]);
      }
    });
  }
}
