import { Injectable, Inject } from '@angular/core';

import { Hajj } from './hajj.model';

@Injectable()
export class HajjService {
    private api: string;

    hajjList: Hajj[] = [
        { id: '1', year: 2018, revenues: 23455, status: 'En cours', 
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
            { id: '1', gender: 'M', firstname: 'Pierre', lastname: 'Paul', birthdate: new Date(1977, 1, 2), mobileNumber: '0665491705', email: 'pierre.paul@mail.fr', address: {}, payments: [{ status: 'P', amount: 1233, date: new Date() }] },
            { id: '2', gender: 'M', firstname: 'Hamim', lastname: 'Ahmed', birthdate: new Date(1952, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr', address: {}, payments: [{ status: 'I', amount: 10255, date: new Date() }] },
            { id: '21', gender: 'M', firstname: 'Vgg', lastname: 'Te', birthdate: new Date(1954, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr', address: {}, payments: [{ status: 'I', amount: 10255, date: new Date() }] },
            { id: '22', gender: 'M', firstname: 'Bbnh', lastname: 'Te', birthdate: new Date(1950, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr', address: {}, payments: [{ status: 'I', amount: 10255, date: new Date() }] },
            { id: '23', gender: 'M', firstname: 'Dswe', lastname: 'Te', birthdate: new Date(1953, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr', address: {}, payments: [{ status: 'I', amount: 10255, date: new Date() }] },
            { id: '24', gender: 'M', firstname: 'Ds', lastname: 'Wert', birthdate: new Date(1960, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr', address: {}, payments: [{ status: 'I', amount: 10255, date: new Date() }] },
            { id: '25', gender: 'M', firstname: 'v', lastname: 'Acfhgu', birthdate: new Date(1940, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr', address: {}, payments: [{ status: 'I', amount: 10255, date: new Date() }] },
            { id: '26', gender: 'M', firstname: 'Qew', lastname: 'Fghu', birthdate: new Date(1943, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr', address: {}, payments: [{ status: 'I', amount: 10255, date: new Date() }] },
            { id: '44', gender: 'M', firstname: 'Ibrahim', lastname: 'Ahmed', birthdate: new Date(1942, 1, 2), mobileNumber: '06623327', email: 'ib.ahmed@mail.fr', address: {}, payments: [{ status: 'P', amount: 1055, date: new Date() }] },            
            { id: '43', gender: 'M', firstname: 'Abd', lastname: 'Ahmed', birthdate: new Date(1946, 1, 2), mobileNumber: '06623327', email: 'ib.ahmed@mail.fr', address: {}, payments: [{ status: 'P', amount: 1055, date: new Date() }] },            
            { id: '45', gender: 'M', firstname: 'Hamz', lastname: 'Ahmed', birthdate: new Date(1945, 1, 2), mobileNumber: '06623327', email: 'ib.ahmed@mail.fr', address: {}, payments: [{ status: 'P', amount: 1055, date: new Date() }] },            
            { id: '46', gender: 'M', firstname: 'Bilel', lastname: 'Ahmed', birthdate: new Date(1945, 1, 2), mobileNumber: '06623327', email: 'ib.ahmed@mail.fr', address: {}, payments: [{ status: 'P', amount: 1055, date: new Date() }] },            
            { id: '47', gender: 'M', firstname: 'Rizw', lastname: 'Ahmed', birthdate: new Date(1945, 1, 2), mobileNumber: '06623327', email: 'ib.ahmed@mail.fr', address: {}, payments: [{ status: 'P', amount: 1055, date: new Date() }] },            
            { id: '3', gender: 'F', firstname: 'Safia', lastname: 'Bouj', birthdate: new Date(1991, 1, 2), mobileNumber: '0688888888', email: 'safia.bouj@mail.fr', address: {}, payments: [{ status: 'P', amount: 1233, date: new Date() }] },
          ]
        },
        { id: '2', year: 2017, revenues: 16775, status: 'Terminé' },
        { id: '3', year: 2016, revenues: 13453, status: 'Terminé' },
        { id: '4', year: 2015, revenues: 12112, status: 'Terminé' },
      ];

    constructor() {
        // this.api = config.ApiEndpoint + '/customers';
    }
}

