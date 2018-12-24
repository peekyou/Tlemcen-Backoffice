import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Hajj } from './hajj.model';
import { AuthHttpService } from '../core/services/auth-http.service';
import { PagingResponse } from '../core/models/paging';

@Injectable()
export class HajjService {
  resource = 'hajjs';

    // hajjList: Hajj[] = [
    //     { id: '1', name: 2018, revenues: 23455, status: 'En cours', 
    //       reservations: [
    //         { id: '1', travelerCount: 22, hotel: { 
    //           name: 'Makkah Millennium Hotel', expanded: true, roomsCount: 57 },
    //           rooms: [
    //             { id: '1', customers: [], roomDetail: { id: '1', number: '3', bedsNumber: 2, personsNumber: 4 }},
    //             { id: '2', customers: [], roomDetail: { id: '2', number: '4', bedsNumber: 2, personsNumber: 4 }},
    //             { id: '3', customers: [], roomDetail: { id: '3', number: '5', bedsNumber: 2, personsNumber: 4 }},
    //             { id: '4', customers: [], roomDetail: { id: '4', number: '6', bedsNumber: 2, personsNumber: 4 }}
    //           ]
    //         },
    //         { id: '2', travelerCount: 12, hotel: { name: 'Sheraton Makkah Jabal Al Kaaba Hotel', expanded: true, roomsCount: 57 }, 
    //           rooms: [
    //           { id: '31', customers: [], roomDetail: { id: '14', number: '3', bedsNumber: 2, personsNumber: 5 }},
    //           { id: '34', customers: [], roomDetail: { id: '24', number: '6', bedsNumber: 2, personsNumber: 5 }}
    //         ]}
    //       ],
    //       airlines: [
    //         { id: '1', name: 'Saudi Airlines', passengerCount: 11 },
    //       ],
    //       customers: [
    //         { id: '1', gender: 'M', firstname: 'Pierre', lastname: 'Paul', birthDate: new Date(1977, 1, 2), mobileNumber: '0665491705', email: 'pierre.paul@mail.fr', address: {}, payments: [{ status: 'P', amountPaid: 1233, date: new Date() }] },
    //         { id: '2', gender: 'M', firstname: 'Hamim', lastname: 'Ahmed', birthDate: new Date(1952, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr', address: {}, payments: [{ status: 'I', amountPaid: 10255, date: new Date() }] },
    //         { id: '21', gender: 'M', firstname: 'Vgg', lastname: 'Te', birthDate: new Date(1954, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr', address: {}, payments: [{ status: 'I', amountPaid: 10255, date: new Date() }] },
    //         { id: '22', gender: 'M', firstname: 'Bbnh', lastname: 'Te', birthDate: new Date(1950, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr', address: {}, payments: [{ status: 'I', amountPaid: 10255, date: new Date() }] },
    //         { id: '23', gender: 'M', firstname: 'Dswe', lastname: 'Te', birthDate: new Date(1953, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr', address: {}, payments: [{ status: 'I', amountPaid: 10255, date: new Date() }] },
    //         { id: '24', gender: 'M', firstname: 'Ds', lastname: 'Wert', birthDate: new Date(1960, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr', address: {}, payments: [{ status: 'I', amountPaid: 10255, date: new Date() }] },
    //         { id: '25', gender: 'M', firstname: 'v', lastname: 'Acfhgu', birthDate: new Date(1940, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr', address: {}, payments: [{ status: 'I', amountPaid: 10255, date: new Date() }] },
    //         { id: '26', gender: 'M', firstname: 'Qew', lastname: 'Fghu', birthDate: new Date(1943, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr', address: {}, payments: [{ status: 'I', amountPaid: 10255, date: new Date() }] },
    //         { id: '44', gender: 'M', firstname: 'Ibrahim', lastname: 'Ahmed', birthDate: new Date(1942, 1, 2), mobileNumber: '06623327', email: 'ib.ahmed@mail.fr', address: {}, payments: [{ status: 'P', amountPaid: 1055, date: new Date() }] },            
    //         { id: '43', gender: 'M', firstname: 'Abd', lastname: 'Ahmed', birthDate: new Date(1946, 1, 2), mobileNumber: '06623327', email: 'ib.ahmed@mail.fr', address: {}, payments: [{ status: 'P', amountPaid: 1055, date: new Date() }] },            
    //         { id: '45', gender: 'M', firstname: 'Hamz', lastname: 'Ahmed', birthDate: new Date(1945, 1, 2), mobileNumber: '06623327', email: 'ib.ahmed@mail.fr', address: {}, payments: [{ status: 'P', amountPaid: 1055, date: new Date() }] },            
    //         { id: '46', gender: 'M', firstname: 'Bilel', lastname: 'Ahmed', birthDate: new Date(1945, 1, 2), mobileNumber: '06623327', email: 'ib.ahmed@mail.fr', address: {}, payments: [{ status: 'P', amountPaid: 1055, date: new Date() }] },            
    //         { id: '47', gender: 'M', firstname: 'Rizw', lastname: 'Ahmed', birthDate: new Date(1945, 1, 2), mobileNumber: '06623327', email: 'ib.ahmed@mail.fr', address: {}, payments: [{ status: 'P', amountPaid: 1055, date: new Date() }] },            
    //         { id: '3', gender: 'F', firstname: 'Safia', lastname: 'Bouj', birthDate: new Date(1991, 1, 2), mobileNumber: '0688888888', email: 'safia.bouj@mail.fr', address: {}, payments: [{ status: 'P', amountPaid: 1233, date: new Date() }] },
    //       ]
    //     },
    //     { id: '2', name: 2017, revenues: 16775, status: 'Terminé' },
    //     { id: '3', name: 2016, revenues: 13453, status: 'Terminé' },
    //     { id: '4', name: 2015, revenues: 12112, status: 'Terminé' },
    //   ];

    constructor(private http: AuthHttpService) { }

  getHajjList(page: number, count: number): Observable<PagingResponse<Hajj>> {
    return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count);
  }

  getHajj(id): Observable<Hajj> {
    return this.http.get(this.resource + '/' + id);
  }

  createHajj(hajj: Hajj): Observable<Hajj> {
    return this.http.post(this.resource, hajj);
  }

  deleteHajj(id: string) : Observable<boolean> {
    return this.http.delete(this.resource + '/' + id);
  }
}

