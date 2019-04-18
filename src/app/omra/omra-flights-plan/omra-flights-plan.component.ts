import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { Omra } from '../omra.model';
import { OmraService } from '../omra.service';

@Component({
  selector: 'app-omra-flights-plan',
  templateUrl: './omra-flights-plan.component.html',
  styleUrls: ['./omra-flights-plan.component.scss']
})
export class OmraFlightsPlanComponent implements OnInit {
  flightBookingId: string;
  omraId: string;
  loader: Subscription;

  constructor(private route: ActivatedRoute, private service: OmraService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.omraId = params['id'];
      this.flightBookingId = params['flightId'];
    });
  }
}