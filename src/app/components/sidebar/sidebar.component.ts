import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/omra', title: 'Omra',  icon: 'layers', class: '' },
    { path: '/hajj', title: 'Hajj',  icon: 'view_compact', class: '' },
    { path: '/voyages', title: 'Voyages',  icon: 'card_travel', class: '' },
    { path: '/customers', title: 'Clients',  icon: 'people', class: '' },
    { path: '/hotels', title: 'Hôtels',  icon: 'hotel', class: '' },
    { path: '/airlines', title: 'Compagnies',  icon: 'flight', class: '' },
    { path: '/payments', title: 'Paiments',  icon: 'payment', class: '' },
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

  constructor() { }

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
