import { Component, OnInit } from '@angular/core';

import { Hajj } from '../hajj.model';
import { HajjService } from '../hajj.service';

@Component({
  selector: 'app-hajj-list',
  templateUrl: './hajj-list.component.html',
  styleUrls: ['./hajj-list.component.scss']
})
export class HajjListComponent implements OnInit {
  hajjList: Hajj[];

  constructor(private service: HajjService) {
    this.hajjList = service.hajjList;  
  }

  ngOnInit() {
  }

}
