import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Campaign } from '../../../campaign.model';
// import { PromotionService } from '../../promotion.service';
import { SmsCounter } from '../../sms-counter';
import { SmsService } from '../../../sms/sms.service';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
    selector: 'app-sms-info',
    styleUrls: ['./sms-info.component.scss'],
    templateUrl: './sms-info.component.html'
})
export class SmsInfoComponent implements OnInit {
    smsQuota: number = 0;    
    campaign: Campaign = new Campaign();

    form: any;
    @Input() topLevelForm: FormGroup;

    private stepName: string = 'stepInfo';
    private formGroup: FormGroup;

    constructor(
      private service: SmsService,
      private translation: TranslationService) {

      this.service.getSmsPack()
          .subscribe(
              res => this.smsQuota = res.quota,
              err => console.log(err)
          );
    }
    
    ngOnInit() {
        this.form = this.topLevelForm.controls[this.stepName];
    }

    getSmsCounter() {
        if (this.details.value == null) {
            this.details.patchValue('');
        }
        var counter = SmsCounter.count(this.details.value);
        this.nbSmsPerCustomer.patchValue(counter.messages);
        return counter;
    }

    smsQuotaValid() {
        var counter = this.getSmsCounter();
        if (counter != null && this.smsQuota != null && this.service.nbRecipients != null) {
            return counter.messages * this.service.nbRecipients <= this.smsQuota;
        }
        return true;
    }
    
    get name() { return this.form.get('name'); }
    get dateFrom() { return this.form.get('dateFrom'); }
    get dateTo() { return this.form.get('dateTo'); }
    get details() { return this.form.get('details'); }
    get nbSmsPerCustomer() { return this.form.get('nbSmsPerCustomer'); }
}