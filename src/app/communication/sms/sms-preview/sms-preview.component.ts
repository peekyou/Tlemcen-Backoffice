import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-sms-preview',
  templateUrl: './sms-preview.component.html',
  styleUrls: ['./sms-preview.component.scss']
})
export class SmsPreviewComponent {
  smsNumber: number;
  sms: string;

  constructor(
    public dialogRef: MatDialogRef<SmsPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) { 
      this.sms = data.sms;
      this.smsNumber = data.smsNumber;
  }

  close(confirm = false) {
    this.dialogRef.close(confirm);
  }
}
