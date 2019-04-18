import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import * as moment from 'moment';

import { LookupService } from '../../../core/services/lookup.service';
import { Lookup } from '../../../core/models/lookup.model';
import { Address } from '../../../core/models/address.model';
import { Customer } from '../../../customers/customer.model';
import { validateDate, filterLookup, dateToMoment, dateToUTC } from '../../../core/helpers/utils';

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
    filteredPassportCountries: Observable<Lookup[]>;
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
        this.customer.gender = this.form.value.gender;
        this.customer.firstname = this.form.value.firstname;
        this.customer.lastname = this.form.value.lastname;
        this.customer.email = this.form.value.email;
        this.customer.mobileNumber = this.form.value.mobile;
        this.customer.phoneNumber = this.form.value.phone;
        this.customer.birthDate = dateToUTC(this.form.value.birthDate);
        this.customer.birthCountry = this.form.value.birthCountry;
        this.customer.howKnewAgency = this.form.value.howKnewAgency ? this.form.value.howKnewAgency.name : null;
        this.customer.passportNumber = this.form.value.passportNumber;
        this.customer.passportExpiryDate = dateToUTC(this.form.value.passportExpiryDate);
        this.customer.passportIssuingCountry = this.form.value.passportIssuingCountry;
        this.customer.nationality = this.form.value.nationality;
        this.customer.profession = this.form.value.profession && this.form.value.profession.name ? this.form.value.profession.name : this.form.value.profession;
        this.customer.bloodGroup = this.form.value.bloodGroup;
        this.customer.medicalInfo = this.form.value.medicalInfo;
        this.customer.isConverted = this.form.value.isConverted == 'T';
        var cityPostalCode = this.getcityPostalCode(this.form.value.cityPostalCode);
        
        if (!this.customer.address) {
            this.customer.address = new Address();
        }
		this.customer.address.city = cityPostalCode[0];
		this.customer.address.postalCode = cityPostalCode[1];
		this.customer.address.addressLine1 = this.form.value.address1;
        this.customer.address.country.id = 'FR';
        
        this.onSave.emit(this.customer);
    }

    setCustomerPicture(picture: WebcamImage) {
        if (!this.customer.picture) {
            this.customer.picture = {};
        }

        if (picture && picture.imageAsDataUrl) {
            this.customer.picture.src = picture.imageAsDataUrl;
            this.customer.picture.mime = "image";
        }
        this.showCamera = false;
    }

    nationalitySelected(value: Lookup) {
        this.birthCountry.patchValue(value);
        this.passportIssuingCountry.patchValue(value);
    }

    passportValidator(event) {
        const pattern = /[A-Za-z0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        return pattern.test(inputChar);
    }

    displayFn(val: Lookup) {
        console.log(val)
        if (typeof val === 'string') {
            return val;
        }
        return val ? val.name : val;
    }

    private initForm() {
        // If src is empty set picture to null to remove the empty image from file upload component
        if (this.customer.picture && !this.customer.picture.src) {
            this.customer.picture = null;
        }

        this.form = this.fb.group({
            gender: this.fb.control(this.customer.gender ? this.customer.gender : 'M', Validators.required),
            firstname: this.fb.control(this.customer.firstname, Validators.required),
            lastname: this.fb.control(this.customer.lastname, Validators.required),
            birthDate: this.fb.control(dateToMoment(this.customer.birthDate), Validators.required),
            mobile: this.fb.control(this.customer.mobileNumber, Validators.required),
            phone: this.fb.control(this.customer.phoneNumber),
            email: this.fb.control(this.customer.email, (c) => this.customEmailValidator(c)),
            birthCountry: this.fb.control(this.customer.birthCountry ? this.customer.birthCountry.id : null),
            nationality: this.fb.control(this.customer.nationality ? this.customer.nationality.id : null, Validators.required),
            profession: this.fb.control(this.customer.profession),
            address1: this.fb.control(this.customer.address ? this.customer.address.addressLine1 : null, Validators.required),
            cityPostalCode: this.fb.control(this.customer.address && this.customer.address.city && this.customer.address.postalCode ? new Lookup(this.customer.address.postalCode + ' - ' + this.customer.address.city, this.customer.address.postalCode + ' - ' + this.customer.address.city) : null, Validators.required),
            passportNumber: this.fb.control(this.customer.passportNumber, Validators.required),
            passportExpiryDate: this.fb.control(dateToMoment(this.customer.passportExpiryDate), Validators.required),
            passportIssuingCountry: this.fb.control(this.customer.passportIssuingCountry ? this.customer.passportIssuingCountry.id : null),
            howKnewAgency: this.fb.control(null),
            isConverted: this.fb.control(this.customer.isConverted ? 'T' : 'F'),
            bloodGroup: this.fb.control(this.customer.bloodGroup),
            medicalInfo: this.fb.control(this.customer.medicalInfo),
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

        this.filteredPassportCountries = this.passportIssuingCountry.valueChanges
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
                howKnewAgency: knewAgency
            });
        }
        if (this.customer && this.customer.birthCountry) {
            var country = this.countries.find(a => a.id == this.customer.birthCountry.id);
            this.form.patchValue({
                birthCountry: country
            });
        }
        if (this.customer && this.customer.nationality) {
            var country = this.countries.find(a => a.id == this.customer.nationality.id);
            this.form.patchValue({
                nationality: country
            });
        }
        if (this.customer && this.customer.passportIssuingCountry) {
            var country = this.countries.find(a => a.id == this.customer.passportIssuingCountry.id);
            this.form.patchValue({
                passportIssuingCountry: country
            });
        }
        if (this.customer && this.customer.profession) {
            var profession = this.professions.find(a => a.name == this.customer.profession);
            this.form.patchValue({
                profession: profession
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
            postalCode = value.id.split(' - ')[0];
            city = value.id.split(' - ')[1];
        }
        else if (typeof value === 'string' && value) {
            var s = <string>value;
            postalCode = s.split(' - ')[0];
            city = s.split(' - ')[1];
        }
        return [city, postalCode];
    }
  
    get cityPostalCode() { return this.form.get('cityPostalCode'); }
    get passportNumber() { return this.form.get('passportNumber'); }
    get birthCountry() { return this.form.get('birthCountry'); }
    get nationality() { return this.form.get('nationality'); }
    get profession() { return this.form.get('profession'); }
    get email() { return this.form.get('email'); }
    get birthDate() { return this.form.get('birthDate'); }
    get passportExpiryDate() { return this.form.get('passportExpiryDate'); }
    get passportIssuingCountry() { return this.form.get('passportIssuingCountry'); }
}
