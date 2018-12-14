import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Omra } from '../omra.model';
import { OmraService } from '../omra.service';
import { OmraDialogComponent } from '../omra-dialog/omra-dialog.component';

@Component({
  selector: 'app-omra-list',
  templateUrl: './omra-list.component.html',
  styleUrls: ['./omra-list.component.scss']
})
export class OmraListComponent implements OnInit {
  omraList: Omra[];
  
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private service: OmraService) {
    this.omraList = service.omraList;  
  }

  ngOnInit() {
  }

  newOmra() {
    let dialogRef = this.dialog.open(OmraDialogComponent, {
      autoFocus: false,
      width: '534px'
    });

    dialogRef.afterClosed().subscribe(newOmra => {
      if (!this.omraList) {
        this.omraList = [];
      }

      if (newOmra) {
        this.omraList = this.service.omraList;
        this.router.navigate(['/omra', newOmra.id]);
      }
    });
  }
}
