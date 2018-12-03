import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Omra } from '../omra.model';
import { OmraService } from '../omra.service';

@Component({
  selector: 'app-omra-list',
  templateUrl: './omra-list.component.html',
  styleUrls: ['./omra-list.component.scss']
})
export class OmraListComponent implements OnInit {
  omraList: Omra[];
  
  constructor(private router: Router, private service: OmraService) {
    this.omraList = service.omraList;  
  }

  ngOnInit() {
  }

  newOmra() {
    var id = new Date().getMilliseconds().toString();
    this.service.omraList.unshift({
      id: id,
      name: 'Janvier 2019',
      customers: [],
      airlines: [],
      reservations: [],
      revenues: 0,
      status: 'En cours'
    });

    this.router.navigate(['/omra', id]);
  }
}
