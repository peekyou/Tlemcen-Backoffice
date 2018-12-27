import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class CustomersTravelService {
  private subject = new Subject<any>();
  
  sendMessage(message: string) {
      this.subject.next({ text: message });
  }

  clearMessage() {
      this.subject.next();
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }
}