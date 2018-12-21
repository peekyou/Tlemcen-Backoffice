import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs'; 

import { Omra } from './omra.model';

@Injectable()
export class OmraService {
    private api: string;

    omraList: Omra[] = [
        { id: '1', name: 'Decembre 2018', revenues: 23455, status: 'En cours', 
          reservations: [
            { id: '1', travelerCount: 22, hotel: { 
              name: 'Makkah Millennium Hotel', expanded: true, roomsCount: 57 },
              rooms: [
                { id: '1', customers: [], roomDetail: { id: '1', number: '3', bedsNumber: 2, personsNumber: 4 }},
                { id: '2', customers: [], roomDetail: { id: '2', number: '4', bedsNumber: 2, personsNumber: 4 }},
                { id: '3', customers: [], roomDetail: { id: '3', number: '5', bedsNumber: 2, personsNumber: 4 }},
                { id: '4', customers: [], roomDetail: { id: '4', number: '6', bedsNumber: 2, personsNumber: 4 }}
              ]
            },
            { id: '2', travelerCount: 12, hotel: { name: 'Sheraton Makkah Jabal Al Kaaba Hotel', expanded: true, roomsCount: 57 }, 
              rooms: [
              { id: '31', customers: [], roomDetail: { id: '14', number: '3', bedsNumber: 2, personsNumber: 5 }},
              { id: '34', customers: [], roomDetail: { id: '24', number: '6', bedsNumber: 2, personsNumber: 5 }}
            ]}
          ],
          airlines: [
            { id: '1', name: 'Saudi Airlines', passengerCount: 11 },
          ],
          customers: [
            { id: '1', gender: 'M', firstname: 'Pierre', lastname: 'Paul', birthDate: new Date(1977, 1, 2), mobileNumber: '0665491705', email: 'pierre.paul@mail.fr', address: {} },
            { id: '2', gender: 'M', firstname: 'Hamim', lastname: 'Ahmed', birthDate: new Date(1952, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr', address: {} },
            { id: '3', gender: 'F', firstname: 'Safia', lastname: 'Bouj', birthDate: new Date(1991, 1, 2), mobileNumber: '0688888888', email: 'safia.bouj@mail.fr', address: {} },
          ]
        },
        { id: '2', name: 'Juillet 2018', revenues: 16775, status: 'Terminé' },
        { id: '3', name: 'Mai 2018', revenues: 13453, status: 'Terminé' },
        { id: '4', name: 'Avril 2018', revenues: 12112, status: 'Terminé' },
      ];

    constructor() {
        // this.api = config.ApiEndpoint + '/customers';
    }

    create(omra: Omra) : Observable<Omra> {
      omra.id = new Date().getMilliseconds().toString();
      this.omraList.unshift(omra);
      return of(omra);
    }
}

