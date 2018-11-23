import { Injectable } from '@angular/core';

import { Airline } from './airline.model';

@Injectable()
export class AirlinesService {

airlines: Airline[] = [
    { id: '1', name: 'Saudi Airlines' },
  ];

  constructor() { }
}
