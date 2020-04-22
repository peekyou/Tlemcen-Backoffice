import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';

import { PagingResponse } from '../../core/models/paging';
import { Hajj } from '../hajj.model';
import { HajjService } from '../hajj.service';
import { HajjDialogComponent } from '../hajj-dialog/hajj-dialog.component';
import { TravelStatus } from '../../travels/travel.model';
import { DeleteDialogComponent } from '../../components/common/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-hajj-list',
  templateUrl: './hajj-list.component.html',
  styleUrls: ['./hajj-list.component.scss']
})
export class HajjListComponent implements OnInit {
  loader: Subscription;
  currentPage: number = 1;
  itemsPerPage: number = 20;
  currentHajj: Hajj[];
  completedHajj: PagingResponse<Hajj>;

  constructor(private router: Router, private service: HajjService, private dialog: MatDialog,) {
    this.getCurrentHajj();
    this.getCompletedHajj();
  }

  ngOnInit() {
  }

  getCurrentHajj() {
    this.loader = this.service.getHajjList(TravelStatus.NotCompleted, null, null)
    .subscribe(
      res => this.currentHajj = res.data,
      err => console.log(err)
    );
  }

  getCompletedHajj() {
    window.scroll(0,0);

    this.service.getHajjList(TravelStatus.Completed, this.currentPage, this.itemsPerPage)
    .subscribe(
      res => this.completedHajj = res,
      err => console.log(err)
    );
  }

  pageChanged(page) {
    this.currentPage = page;
    this.getCompletedHajj();
  }

  openHajjDialog(hajj: Hajj = null) {
    let dialogRef = this.dialog.open(HajjDialogComponent, {
      autoFocus: true,
      width: '534px',
      data: {
        hajj: hajj
      }
    });

    dialogRef.afterClosed().subscribe(newHajj => {
      if (newHajj && newHajj.id) {
        this.router.navigate(['/hajj', newHajj.id]);
      }
    });
  }

  openDeleteDialog(hajj: Hajj) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { name: hajj.name }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.deleteTravel(hajj.id)
        .subscribe(
          res => {
            var index = this.currentHajj.indexOf(hajj);
            if (index > -1) {
                this.currentHajj.splice(index, 1);
            }
            else {
              index = this.completedHajj.data.indexOf(hajj);
              if (index > -1) {
                  this.completedHajj.data.splice(index, 1);
                  this.completedHajj.paging.totalCount--;
              }
            }
          },
          err => console.log(err)
        );
      }
    });
  }
}
