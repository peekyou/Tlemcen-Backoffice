import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';

import { PagingResponse } from '../../core/models/paging';
import { Hajj } from '../hajj.model';
import { HajjService } from '../hajj.service';
import { HajjDialogComponent } from '../hajj-dialog/hajj-dialog.component';

@Component({
  selector: 'app-hajj-list',
  templateUrl: './hajj-list.component.html',
  styleUrls: ['./hajj-list.component.scss']
})
export class HajjListComponent implements OnInit {
  loader: Subscription;
  currentPage: number = 1;
  itemsPerPage: number = 20;
  hajjList: PagingResponse<Hajj>;

  constructor(private router: Router, private service: HajjService, private dialog: MatDialog,) {
    this.getHajjList();
  }

  ngOnInit() {
  }

  getHajjList() {
    window.scroll(0,0);

    this.loader = this.service.getHajjList(this.currentPage, this.itemsPerPage)
    .subscribe(
      res => this.hajjList = res,
      err => console.log(err)
    );
  }

  pageChanged(page) {
    this.currentPage = page;
    this.getHajjList();
  }

  newHajj() {
    let dialogRef = this.dialog.open(HajjDialogComponent, {
      autoFocus: true,
      width: '534px'
    });

    dialogRef.afterClosed().subscribe(newHajj => {
      if (newHajj) {
        this.router.navigate(['/hajj', newHajj.id]);
      }
    });
  }
}
