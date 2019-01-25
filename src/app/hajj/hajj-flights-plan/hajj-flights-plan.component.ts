import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { Hajj } from '../hajj.model';
import { HajjService } from '../hajj.service';

@Component({
  selector: 'app-hajj-flights-plan',
  templateUrl: './hajj-flights-plan.component.html',
  styleUrls: ['./hajj-flights-plan.component.scss']
})
export class HajjFlightsPlanComponent implements OnInit {
  flightBookingId: string;
  hajjId: string;
  loader: Subscription;

  constructor(private route: ActivatedRoute, private service: HajjService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.hajjId = params['id'];
      this.flightBookingId = params['flightId'];
    });
  }
}
