import { Injectable } from '@angular/core';

import { Hotel } from './hotel.model';

@Injectable()
export class HotelsService {

  hotels: Hotel[] = [
    { id: '1', name: 'Jabal Omar Hyatt Regency', roomsCount: 111, phone: '+9667777777', address: {} },
    { id: '2', name: 'Sheraton Makkah Jabal Al Kaaba Hotel', roomsCount: 54, phone: '+96632243', address: {} },
    { id: '3', name: 'Hilton Makkah Convention Hotel', roomsCount: 64, phone: '+96621345', address: {} },
    { id: '4', name: 'Swissotel Al Maqam Makkah', roomsCount: 67, phone: '+966765321', address: {} },
  ];

  constructor() { }
}
