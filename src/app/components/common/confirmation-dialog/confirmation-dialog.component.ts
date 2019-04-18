import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ModalButtons } from '../../../core/models/modal';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  text: string;
  title: string;
  buttons = ModalButtons.YesNo;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>) { 
      if (data && data.title) {
        this.title = data.title;
      }
      if (data && data.text) {
        this.text = data.text;
      }
      if (data && data.buttons) {
        this.buttons = data.buttons;
      } 
  }

  ngOnInit() {
  }

  close(confirm = false) {
    this.dialogRef.close(confirm);
  }
}
