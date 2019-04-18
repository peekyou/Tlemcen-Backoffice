import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../auth/auth.service';
import { Roles } from '../../core/helpers/roles';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    roles?: string[];
}
export const ROUTES: RouteInfo[] = [
    // { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/omra', title: 'Omra',  icon: 'layers', class: '', roles: [Roles.Admin, Roles.Omra] },
    { path: '/hajj', title: 'Hajj',  icon: 'view_compact', class: '', roles: [Roles.Admin, Roles.Hajj] },
    { path: '/voyages', title: 'Voyages',  icon: 'card_travel', class: 'inactive', roles: [Roles.Admin, Roles.Travels] },
    { path: '/customers', title: 'Clients',  icon: 'people', class: '', roles: [Roles.Admin, Roles.Customers] },
    { path: '/hotels', title: 'Hôtels',  icon: 'hotel', class: '', roles: [Roles.Admin, Roles.Hotels] },
    { path: '/airlines', title: 'Compagnies',  icon: 'flight', class: '', roles: [Roles.Admin, Roles.Airlines] },
    { path: '/payments', title: 'Paiements',  icon: 'payment', class: '', roles: [Roles.Admin, Roles.Payments] },
    { path: '/communication', title: 'Communication',  icon: 'forum', class: '', roles: [Roles.Admin, Roles.Communication] },
    { path: '/management', title: 'Gestion',  icon: 'settings', class: '', roles: [Roles.Admin, Roles.DocumentsManagement, Roles.FeesManagement, Roles.UserManagement] },
    { path: '/notes', title: 'Notes', icon: 'note', class: '' },        
    // { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
    // { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    // { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
    // { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    // { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(public user: AuthService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  isMobileMenu() {
      if (window.innerWidth > 991) {
          return false;
      }
      return true;
  };
}
