import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { ServiceFeeDialogComponent } from '../service-fee-dialog/service-fee-dialog.component';
import { HajjService } from '../../../hajj/hajj.service';
import { OmraService } from '../../../omra/omra.service';
import { HotelsService } from '../../../hotels/hotels.service';
import { AirlinesService } from '../../../airlines/airlines.service';
import { FeeService } from '../fee.service';

@Component({
  selector: 'app-fee-list',
  templateUrl: './fee-list.component.html',
  styleUrls: ['./fee-list.component.scss']
})
export class FeeListComponent implements OnInit {
  hajjOmraList: any[];
  flights: any[];
  hotels: any[];
  additionalFees: any[];

  constructor(
    private dialog: MatDialog,
    private feeService: FeeService,
    private hajjService: HajjService,
    private omraService: OmraService,
    private hotelService: HotelsService,
    private airlineService: AirlinesService) { 
      this.hajjOmraList = hajjService.hajjList.concat(omraService.omraList);
      this.hotels = hotelService.hotels;
      this.flights = airlineService.airlines;
    }

  ngOnInit() {
  }

  openServiceFeeDialog() {
    let dialogRef = this.dialog.open(ServiceFeeDialogComponent, {
      autoFocus: false,
      width: '534px'
    });

    dialogRef.afterClosed().subscribe(newFee => {
      if (!this.additionalFees) {
        this.additionalFees = [];
      }

      if (newFee) {
        this.additionalFees.push(newFee);
      }
    });
  }
}
