import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

import { TranslationService } from '../../../../core/services/translation.service';
import { Campaign, CampaignFilter } from '../../../campaign.model';
import { SmsService } from '../../sms.service';
import { CustomersService } from '../../../../customers/customers.service';
import { TravelService } from '../../../../travels/travel.service';
import { Lookup } from '../../../../core/models/lookup.model';
import { validateDate } from '../../../../core/helpers/utils';

@Component({
    selector: 'app-sms-filter',
    styleUrls: ['./sms-filter.component.scss'],
    templateUrl: './sms-filter.component.html'
})
export class SmsFilterComponent implements OnInit {
  validateDate: Function;
  form: any;
  infoForm: any;
  promotions: Campaign[] = [];
  searchStr;
  nbRecipients: number = 0;
  totalNbCustomers: number = 0;
  anyCustomField = false;
  promotionType: string = 'sms';
  currentFilter: CampaignFilter;
  @Input() topLevelForm: FormGroup;

  private stepName: string = 'stepFilter';

  constructor(
    private service: SmsService, 
    private travelService: TravelService,
    private customerService: CustomersService,
    private translation: TranslationService) {

      this.validateDate = validateDate;
      customerService.getCustomersCount()
          .subscribe(
              res => this.totalNbCustomers = this.nbRecipients = res,
              err => console.log(err)
          );

      this.getCities();
      this.getTravels();
      this.getCampaigns();
  }
      
  ngOnInit() {
      this.infoForm = this.topLevelForm.controls['stepInfo'];
      this.form = this.topLevelForm.controls[this.stepName];

      this.form.valueChanges.subscribe(data => this.filterCustomers(data));

      this.translation.getMultiple([
          'COMMON.SEARCH',
          'CAMPAIGNS.SELECT_LOCATION',
          'COMMON.SELECT_ALL',
          'COMMON.UNSELECT_ALL',
          'COMMON.ALL_SELECTED',
          'COMMON.ITEMS_SELECTED'], x => {
              
            this.multiSelectTexts = {
                checkAll: x['COMMON.SELECT_ALL'],
                uncheckAll: x['COMMON.UNSELECT_ALL'],
                checked: x['COMMON.ITEMS_SELECTED'],
                checkedPlural: x['COMMON.ITEMS_SELECTED'],
                searchPlaceholder: x['COMMON.SEARCH'],
                searchEmptyResult: 'Nothing found...',
                searchNoRenderText: 'Type in search box to see results...',
                defaultTitle: x['CAMPAIGNS.SELECT_LOCATION'],
                allSelected: x['COMMON.ALL_SELECTED'],
            };

            this.multiSelectTextsTravels = {
              checkAll: x['COMMON.SELECT_ALL'],
              uncheckAll: x['COMMON.UNSELECT_ALL'],
              checked: x['COMMON.ITEMS_SELECTED'],
              checkedPlural: x['COMMON.ITEMS_SELECTED'],
              searchPlaceholder: x['COMMON.SEARCH'],
              searchEmptyResult: 'Nothing found...',
              searchNoRenderText: 'Type in search box to see results...',
              defaultTitle: 'Sélectionner un voyage',
              allSelected: x['COMMON.ALL_SELECTED'],
          };
      });
  }

  getCampaigns() {
    this.service
      .getSmsCampaigns(null, null)
      .subscribe(promotions => {
        if (promotions && promotions.paging.itemsCount > 0) {
          this.promotions = [...promotions.data]; // clone the array
          if (this.promotions[0].id !== '') {
            this.promotions.unshift({ id: '', name: '' });
          }
        }
      },
      err => { console.log(err); });
  }

  getCities() {
    this.customerService.getCustomerCities()
      .subscribe(
        cities => {
          this.locations = <IMultiSelectOption[]>cities;
          // Issue of the dropdown module. If parent is null, unchek does not work properly
          this.locations.forEach(x => x.parentId = x.parentId ? x.parentId : undefined);
        },
        err => { console.log(err); 
      });
  }

  getTravels() {
    this.travelService.getTravelsAsLookup()
      .subscribe(travels => {
        this.travels = <IMultiSelectOption[]>travels;
        // Issue of the dropdown module. If parent is null, unchek does not work properly
        this.travels.forEach(x => x.parentId = x.parentId ? x.parentId : undefined);
      },
      err => { console.log(err); 
    });
  }

  filterCustomers(form: any) {
      if (form) {
        this.currentFilter = CampaignFilter.createFromForm(form);
      }
      this.service
          .customerCount(this.currentFilter).subscribe(c => {
            this.nbRecipients = this.service.nbRecipients = c;
            this.topLevelForm.get('stepInfo').get('nbRecipients').patchValue(c);
          },
          err => { console.log(err); });
  }

  // Cities multi select
  multiSelectSettings: IMultiSelectSettings = {
      enableSearch: false,
      ignoreLabels: true,
      checkedStyle: 'checkboxes',
      buttonClasses: 'multi-form-control multi-form-control-sm',
      dynamicTitleMaxItems: 3,
      displayAllSelectedText: true,
      showCheckAll: true,
      showUncheckAll: true
  };
  
  // Text configuration
  multiSelectTexts: IMultiSelectTexts;
  multiSelectTextsTravels: IMultiSelectTexts;
  locations: IMultiSelectOption[] = [];
  travels: IMultiSelectOption[] = [];
}