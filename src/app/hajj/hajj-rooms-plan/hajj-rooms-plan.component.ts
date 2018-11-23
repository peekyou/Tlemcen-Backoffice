import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Hajj } from '../hajj.model';
import { HajjService } from '../hajj.service';

@Component({
  selector: 'app-hajj-rooms-plan',
  templateUrl: './hajj-rooms-plan.component.html',
  styleUrls: ['./hajj-rooms-plan.component.scss']
})
export class HajjRoomsPlanComponent implements OnInit {
  hajj: Hajj;

  constructor(private route: ActivatedRoute, private service: HajjService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']) {
          this.hajj = this.service.hajjList.filter(c => c.id == params['id'])[0];
      }
    });
  }

}
