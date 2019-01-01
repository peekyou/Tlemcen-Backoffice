import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { Hajj } from '../hajj.model';
import { HajjService } from '../hajj.service';

@Component({
  selector: 'app-hajj-rooms-plan',
  templateUrl: './hajj-rooms-plan.component.html',
  styleUrls: ['./hajj-rooms-plan.component.scss']
})
export class HajjRoomsPlanComponent implements OnInit {
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
