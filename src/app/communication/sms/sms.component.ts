import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Observable, Subscription } from 'rxjs';

import { ConfirmationDialogComponent } from '../../components/common/confirmation-dialog/confirmation-dialog.component';
import { SmsPackDialogComponent } from './sms-pack-dialog/sms-pack-dialog.component';
import { TranslationService } from '../../core/services/translation.service';
import { ModalButtons } from '../../core/models/modal';
import { SmsService } from './sms.service';
import { SmsPack } from './sms-pack.model';
import { Campaign, CampaignFilter } from '../campaign.model';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss']
})
export class SmsComponent implements OnInit {
  reload = false;
  modalSentence: string;
  smsPack: SmsPack = new SmsPack();

  // New promotion fields
  smsSentence: string = '';
  topLevelForm: FormGroup;
  submitSubscription: Subscription;

  constructor(
    private service: SmsService,
    private translation: TranslationService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder) { 
          
      this.initForm();
      this.service.getSmsPack().subscribe(res => this.smsPack = res);

      this.translation.getMultiple([
        'SMS.MODAL_SENTENCE'], x => {
            this.modalSentence = x['SMS.MODAL_SENTENCE'];
      });
  }

  ngOnInit() {
    var payment = this.route.snapshot.paramMap.get('payment');
    var packCount = this.route.snapshot.paramMap.get('c');
    

    this.route.queryParamMap.subscribe(params => {
      var payment = params.get('payment');
      var packCount = params.get('c');
      if (payment == 's' && packCount) {
        this.service.buyPack(parseInt(packCount))
          .subscribe(
            res => this.smsPack.quota += res,
            err => console.log(err)
          );
      }
  });
  }

  initForm() {
      var firstForm = this.fb.group({
          name: ['', Validators.required],
          details: [this.smsSentence, Validators.required],
          nbRecipients: [null],
          nbSmsPerCustomer: [null]
      });

      var secondForm = this.fb.group({
          purchaseAmountMin: [''],
          purchaseAmountMax: [''],
          customerName: [''],
          customerGenderMale: [true],
          customerGenderFemale: [true],
          location: [[]],
          travel: [null],
          customerAgeFrom: [null],
          customerAgeTo: [null],
          customerSince: [null],
          lastEntryFrom: [null],
          lastEntryTo: [null],
          receivedPromotion: [''],
          didntReceivePromotion: ['']
      });

      this.topLevelForm = this.fb.group({
          stepInfo: firstForm,
          stepFilter: secondForm
      });
  }

  openModal() {
      var promoInfo = this.topLevelForm.value['stepInfo'];
      var sentence = '';
      sentence = this.modalSentence.replace('{{smsNumber}}', (promoInfo.nbRecipients * promoInfo.nbSmsPerCustomer).toString());

      let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '534px',
        autoFocus: false,
        data: {
          text: sentence,
          buttons: ModalButtons.OkCancel
        }
      });
  
      dialogRef.afterClosed().subscribe(res => {
        if (res === true) {
          this.submit();
        }
      });
  }
  
  submit() {
      var promoInfo = this.topLevelForm.value['stepInfo'];
      var promoFilter = this.topLevelForm.value['stepFilter'];
      let newCampaign: Campaign = {
          createdDate: new Date(),
          content: promoInfo.details,
          name: promoInfo.name,
          promotionType: promoInfo.promotionType,
          // fromDate: ngbDateStructToDate(promoInfo.dateFrom),
          // toDate: ngbDateStructToDate(promoInfo.dateTo),
          nbRecipients: promoInfo.nbRecipients,
          campaignFilter: CampaignFilter.createFromForm(promoFilter)
      };

      this.submitSubscription = this.service
        .createCampaign(newCampaign)
        .subscribe(p => {
            this.reload = true;
            this.reset();
        });
  }

  reset() {
      this.topLevelForm.reset();
  }

  openSmsPackModal() {
    let dialogRef = this.dialog.open(SmsPackDialogComponent, {
      width: '534px',
      data: {
        smsPack: this.smsPack
      }
    });
  }
}
