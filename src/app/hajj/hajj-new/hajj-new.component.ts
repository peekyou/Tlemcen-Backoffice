import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { SearchCustomerDialogComponent } from '../../components/customers/search-customer-dialog/search-customer-dialog.component';

@Component({
  selector: 'app-hajj-new',
  templateUrl: './hajj-new.component.html',
  styleUrls: ['./hajj-new.component.scss']
})
export class HajjNewComponent implements OnInit {
  currentDate = new Date();

  constructor(
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  openAddCustomerDialog() {
    let dialogRef = this.dialog.open(SearchCustomerDialogComponent, {
        autoFocus: false,
        width: '534px',
        data: {
          title: 'Hajj ' + this.currentDate.getFullYear()
        }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
        }
    });
  }
}
