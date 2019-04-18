import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DashboardModel } from './dashboard-tlemcen.model';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard-tlemcen',
  templateUrl: './dashboard-tlemcen.component.html',
  styleUrls: ['./dashboard-tlemcen.component.scss']
})
export class DashboardTlemcenComponent implements OnInit {
  activeTab = 1;
  loader: Subscription;
  model: DashboardModel;

  constructor(service: DashboardService) { 
    this.loader = service.getTravelsSummary().subscribe(res => this.model = res);
  }

  ngOnInit() {
  }

}
