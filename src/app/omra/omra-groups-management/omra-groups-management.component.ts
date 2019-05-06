import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { Omra } from '../omra.model';
import { OmraService } from '../omra.service';

@Component({
  selector: 'app-omra-groups-management',
  templateUrl: './omra-groups-management.component.html',
  styleUrls: ['./omra-groups-management.component.scss']
})
export class OmraGroupsManagementComponent implements OnInit {
  omraId: string;
  loader: Subscription;
  
  constructor(private route: ActivatedRoute, private service: OmraService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.omraId = params['id'];
    });
  }
}
