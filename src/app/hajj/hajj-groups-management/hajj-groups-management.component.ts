import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { Hajj } from '../hajj.model';
import { HajjService } from '../hajj.service';

@Component({
  selector: 'app-hajj-groups-management',
  templateUrl: './hajj-groups-management.component.html',
  styleUrls: ['./hajj-groups-management.component.scss']
})
export class HajjGroupsManagementComponent implements OnInit {
  hajj: Hajj;
  loader: Subscription;

  constructor(private route: ActivatedRoute, private service: HajjService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']) {
        this.loader = this.service.getHajj(params['id'], null).subscribe(res => this.hajj = res );
      }
    });
  }
}
