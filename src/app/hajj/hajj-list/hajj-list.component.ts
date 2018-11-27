import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Hajj } from '../hajj.model';
import { HajjService } from '../hajj.service';

@Component({
  selector: 'app-hajj-list',
  templateUrl: './hajj-list.component.html',
  styleUrls: ['./hajj-list.component.scss']
})
export class HajjListComponent implements OnInit {
  hajjList: Hajj[];

  constructor(private router: Router, private service: HajjService) {
    this.hajjList = service.hajjList;  
  }

  ngOnInit() {
  }

  newHajj() {
    var id = new Date().getMilliseconds().toString();
    this.service.hajjList.unshift({
      id: id,
      year: 2019,
      customers: [],
      airlines: [],
      hotels: [],
      revenues: 0,
      status: 'En cours'
    });

    this.router.navigate(['/hajj', id]);
  }
}
