import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SmsService } from '../sms.service';
import { SmsPack } from '../sms-pack.model';

@Component({
  selector: 'app-sms-pack-dialog',
  templateUrl: './sms-pack-dialog.component.html',
  styleUrls: ['./sms-pack-dialog.component.scss']
})
export class SmsPackDialogComponent implements OnInit {
  packNumber: number = 1;
  smsPack: SmsPack = new SmsPack();
  quota = 0;
  currency: string = "€";

  constructor(
    private service: SmsService,
    public dialogRef: MatDialogRef<SmsPackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) {
      
  }

  ngOnInit() {
    
  }

  cancel() {
    this.dialogRef.close();
  }

  onInputChange(event: KeyboardEvent) {
    if (!(event.charCode >= 48 && event.charCode <= 57)) {
        event.preventDefault();
    }
  }

  // openModal() {
  //   let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //       autoFocus: false,
  //       width: '534px',
  //       data: {
  //         text: "Vous achetez" + (this.packNumber * this.smsPack.smsNumber).toString() + " SMS pour " + (this.packNumber * this.smsPack.price).toString() + this.currency
  //       }
  //   });

  //   dialogRef.afterClosed().subscribe(res => {
  //     if (res === true) {
  //       this.service.buyPack(this.packNumber)
  //       .subscribe(
  //           res => this.quota += res,
  //           err => console.log(err)
  //       );
  //     }
  //   });
  // }
}
