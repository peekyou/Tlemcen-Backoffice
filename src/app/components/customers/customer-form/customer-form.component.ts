import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

import { LookupService } from '../../../core/services/lookup.service';
import { Lookup } from '../../../core/models/lookup.model';
import { Customer } from '../../../customers/customer.model';
import { validateDate, filterLookup } from '../../../core/helpers/utils';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
    validateDate: Function;
    form: FormGroup;
    showCamera = false;
    filteredCities: Observable<Lookup[]>;
    filteredProfessions: Observable<Lookup[]>;
    filteredCountries: Observable<Lookup[]>;
    filteredNationalities: Observable<Lookup[]>;
    cities: Lookup[] = [];
    professions: Lookup[] = [];
    countries: Lookup[] = [];
    nationalities: Lookup[] = [];
    knewAgency: Lookup[] = [];

    @Input() customer: Customer = new Customer();
    @Input() submitSubscription;
    @Output() onSave: EventEmitter<any> = new EventEmitter();
    @Output() onCancel: EventEmitter<any> = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private lookupService: LookupService,
        private router: Router) {

        this.validateDate = validateDate;
    }

    ngOnInit() {
        this.initForm();
        
        forkJoin(
            this.lookupService.fetchCountries('fr'),
            this.lookupService.fetchProfessions('fr'),
            this.lookupService.fetchCities('fr'),
            this.lookupService.fetchKnewAgency('fr')
        )
        .subscribe(res => {
            this.countries = res[0];
            this.nationalities = res[0];
            this.professions = res[1];
            this.cities = res[2];
            this.knewAgency = res[3];
            this.patchLookups();
        });
    }

    cancel() {
        this.onCancel.emit(this.customer);
    }

    save() {
        var newCustomer = new Customer();
        newCustomer.gender = this.form.value.gender;
        newCustomer.firstname = this.form.value.firstname;
        newCustomer.lastname = this.form.value.lastname;
        newCustomer.email = this.form.value.email;
        newCustomer.mobileNumber = this.form.value.mobile;
        newCustomer.phoneNumber = this.form.value.phone;
        newCustomer.birthDate = this.form.value.birthDate;
        newCustomer.birthCountryCode = this.form.value.birthCountry ? this.form.value.birthCountry.id : null;
        newCustomer.howKnewAgency = this.form.value.howKnewAgency ? this.form.value.howKnewAgency.name : null;
        newCustomer.passportNumber = this.form.value.passportNumber;
        newCustomer.passportExpiryDate = this.form.value.passportExpiryDate;
        newCustomer.nationalityCode = this.form.value.nationality ? this.form.value.nationality.id : null;
        newCustomer.profession = this.form.value.profession ? this.form.value.profession.name : null;
		var cityPostalCode = this.getcityPostalCode(this.form.value.cityPostalCode);
		newCustomer.address.city = cityPostalCode[0];
		newCustomer.address.postalCode = cityPostalCode[1];
		newCustomer.address.addressLine1 = this.form.value.address1;
		newCustomer.address.country.id = 'FR';
        
		this.onSave.emit(newCustomer);
    }

    addPicture = (file, customer: Customer) => {
    // this.service
    //     .uploadFile(file, page.id)
    //     .subscribe(
    //         r => {
    //             file.id = r;
    //             page.pictures.push(file);
    //         },
    //         err => { console.log(err); }
    //     );
    }

    setCustomerPicture(picture: WebcamImage) {
        if (!this.customer.picture) {
            this.customer.picture = {};
        }

        if (picture && picture.imageAsDataUrl) {
            this.customer.picture.src = picture.imageAsDataUrl;
        }
        this.showCamera = false;
    }

    displayFn(val: Lookup) {
        if (typeof val === 'string') {
            var l = this.nationalities ? this.nationalities.find(a => a.id == val) : null;
            return l ? l.name : val;
        }
        return val ? val.name : val;
    }

    private initForm() {
        this.form = this.fb.group({
            gender: this.fb.control(this.customer.gender ? this.customer.gender : 'M', Validators.required),
            firstname: this.fb.control(this.customer.firstname, Validators.required),
            lastname: this.fb.control(this.customer.lastname, Validators.required),
            birthDate: this.fb.control(this.customer.birthDate, Validators.required),
            mobile: this.fb.control(this.customer.mobileNumber),
            phone: this.fb.control(this.customer.phoneNumber),
            email: this.fb.control(this.customer.email, (c) => this.customEmailValidator(c)),
            birthCountry: this.fb.control(this.customer.birthCountryCode),
            nationality: this.fb.control(this.customer.nationalityCode),
            profession: this.fb.control(this.customer.profession),
            address1: this.fb.control(this.customer.address.addressLine1),
            cityPostalCode: this.fb.control(null),
            passportNumber: this.fb.control(this.customer.passportNumber),
            passportExpiryDate: this.fb.control(this.customer.passportExpiryDate),
            howKnewAgency: this.fb.control(null),
        });

        this.filteredNationalities = this.nationality.valueChanges
            .pipe(
                startWith(''),
                debounceTime(200),
                distinctUntilChanged(),
                map(option => option && option.length >= 2 ? filterLookup(option, this.nationalities) : [])
            );

        this.filteredCountries = this.birthCountry.valueChanges
            .pipe(
                startWith(''),
                debounceTime(200),
                distinctUntilChanged(),
                map(option => option && option.length >= 2 ? filterLookup(option, this.countries) : [])
            );

        this.filteredProfessions = this.profession.valueChanges
            .pipe(
                startWith(''),
                debounceTime(200),
                distinctUntilChanged(),
                map(option => option && option.length >= 2 ? filterLookup(option, this.professions) : [])
            );

        this.filteredCities = this.cityPostalCode.valueChanges
            .pipe(
                startWith(''),
                debounceTime(200),
                distinctUntilChanged(),
                map(option => option && option.length >= 3 ? filterLookup(option, this.cities) : [])
            );
    }

    private patchLookups() {
        if (this.customer && this.customer.howKnewAgency) {
            var knewAgency = this.knewAgency.find(a => a.name == this.customer.howKnewAgency);
            this.form.patchValue({
                howKnewAgency: knewAgency.id
            });
        }
    }

    private customEmailValidator(control: AbstractControl): ValidationErrors {
        if (!control.value) {
            return null;
        }
        return Validators.email(control);
    }

    private getcityPostalCode(value: Lookup) {
        var city = null;
        var postalCode = null;
        if (value && value.id) {
            city = value.id;
            postalCode = value.name.split(' - ')[0];
        }
        return [city, postalCode];
    }
  
    get cityPostalCode() { return this.form.get('cityPostalCode'); }
    get birthCountry() { return this.form.get('birthCountry'); }
    get nationality() { return this.form.get('nationality'); }
    get profession() { return this.form.get('profession'); }
    get email() { return this.form.get('email'); }
    get birthDate() { return this.form.get('birthDate'); }
    get passportExpiryDate() { return this.form.get('passportExpiryDate'); }
}
