import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../auth/auth.service';
import { Roles } from '../../core/helpers/roles';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {
  feeManagementRole = Roles.FeesManagement;
  documentManagementRole = Roles.DocumentsManagement;
  userManagementRole = Roles.UserManagement;

  constructor(public user: AuthService) { }

  ngOnInit() {
  }

}
