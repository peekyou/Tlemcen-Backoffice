import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AuthHttpService } from './auth-http.service';

@Injectable()
export class DemoService {
  resource = 'demo';

  constructor(private http: AuthHttpService) { }

  populateCustomers(count: number) : Observable<void> {
    return this.http.post(this.resource + '/customers/' + count, {});
  }

  deleteDatabase() : Observable<boolean> {
    return this.http.delete(this.resource);
  }
}
