import { Component, OnInit, Input } from '@angular/core';

import { TravelService } from '../../../travels/travel.service';

@Component({
  selector: 'app-groups-management',
  templateUrl: './groups-management.component.html',
  styleUrls: ['./groups-management.component.scss']
})
export class GroupsManagementComponent implements OnInit {
  @Input() travelId: string;

  constructor(private service: TravelService) { }

  ngOnInit() {
    if (this.travelId) {
    }
  }

}
