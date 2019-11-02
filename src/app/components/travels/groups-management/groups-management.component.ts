import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DragulaService } from 'ng2-dragula';
import { Subscription, forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TravelService } from '../../../travels/travel.service';
import { TravelType } from '../../../travels/travel.model';
import { TravelGroup } from '../../../travels/travel-group.model';
import { CustomerDetail } from '../../../customers/customer-detail.model';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { HotelBookingDialogComponent } from '../../hotels/hotel-booking-dialog/hotel-booking-dialog.component';
import { HotelReservation } from '../../../hotels/hotel-reservation.model';
import { generateGroupId } from '../../../core/helpers/utils';
import { ToasterService } from '../../../core/services/toaster.service';
import { ToasterType } from '../../../core/models/toaster-type';

@Component({
  selector: 'app-groups-management',
  templateUrl: './groups-management.component.html',
  styleUrls: ['./groups-management.component.scss']
})
export class GroupsManagementComponent implements OnInit {
  @Input() travelId: string;
  groups: TravelGroup[];
  travelersAlone: CustomerDetail[];
  loader: Subscription;
  saveLoader: Subscription;
  customersExpanded: boolean = true;
  
  constructor(
    public toasterService: ToasterService,
    private service: TravelService,
    private dragulaService: DragulaService,
    private dialog: MatDialog,
    private router: Router) {

    if (!dragulaService.find('GROUPS')) {
      dragulaService.createGroup('GROUPS', {
       
      });
    }

    // this.dragulaService.drop('GROUPS')
    // .pipe(
    //   switchMap((v, i) => {
    //   return of({
    //       confirmed: window.confirm('Confirm'),
    //       event: v 
    //   });
    // }))
    // .subscribe(v => {
    //   if (v.confirmed === false) {
    //     console.log(v);
    //     this.dragulaService.find('GROUPS').drake.cancel(true);
    //   }
    // });
   }

  ngOnInit() {
    if (this.travelId) {
      this.loader = forkJoin(
        this.service.getGroups(this.travelId),
        this.service.getTravelersAlone(this.travelId)
      )
      .subscribe(res => {
        this.groups = res[0];
        this.travelersAlone = res[1];
      });
    }
  }

  createGroup() {
    this.groups.unshift({
      groupId: generateGroupId(),
      travel: { id: this.travelId },
      customers: []
    });
  }

  save() {
    this.saveLoader = this.service.saveGroups(this.travelId, this.groups)
    .subscribe(res => {
      this.toasterService.showToaster('Groupes sauvegardés', ToasterType.Success);
    });
  }
  
  goBack() {
    var path = this.groups[0].travel.travelTypeId == TravelType.Omra ? 'omra' : this.groups[0].travel.travelTypeId == TravelType.Hajj ? 'hajj' : 'travel';
    this.router.navigate(['/' + path, this.travelId]);
  }

  goToGroupDetails(group: TravelGroup, $event) {
    if ($event.target.className.indexOf('drag-container card') > -1 && group.customers && group.customers.length > 0) {
      var path = this.groups[0].travel.travelTypeId == TravelType.Omra ? 'omra' : this.groups[0].travel.travelTypeId == TravelType.Hajj ? 'hajj' : 'travel';
      this.router.navigate(['/' + path, this.travelId, 'customers', group.customers[0].id]);
    }
  }
}
