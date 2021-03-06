import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { Omra } from '../omra.model';
import { OmraService } from '../omra.service';

@Component({
  selector: 'app-omra-rooms-plan',
  templateUrl: './omra-rooms-plan.component.html',
  styleUrls: ['./omra-rooms-plan.component.scss']
})
export class OmraRoomsPlanComponent implements OnInit {
  omra: Omra;
  loader: Subscription;
  
  constructor(private route: ActivatedRoute, private service: OmraService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']) {
        this.loader = this.service.getOmra(params['id'], null).subscribe(res => this.omra = res );
      }
    });
  }
}
