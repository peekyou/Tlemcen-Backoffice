import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html'
})
export class ErrorMessageComponent implements OnInit {
  message: string;
  _error: boolean | string;
  @Input() defaultMessage: string;

  @Input() 
  get error(): boolean | string {
      return this._error;
  }

  set error(value: boolean | string) {
      this._error = value;
      if (typeof value === 'string') {
          this.getErrorMessageTranslation(value);
      }
      else {
          if (this._error === true) {
              this.message = this.defaultMessage;
          }
      }
  }
  
  constructor(private translation: TranslationService) {
    }

  ngOnInit() { }

  getErrorMessageTranslation(messageKey: string) {
      this.translation.get('ERRORS.' + messageKey, x => {
          this.message = x;
          this._error = true;
      });
  }
}
