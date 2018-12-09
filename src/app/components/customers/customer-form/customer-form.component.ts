import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

import { LookupService } from '../../../core/services/lookup.service';
import { Lookup } from '../../../core/models/lookup.model';
import { Customer } from '../../../customers/customer.model';
import { CustomersService } from '../../../customers/customers.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
    form: FormGroup;
    loader: Subscription;
    loading = false
    showCamera = false;
    filteredCities: Observable<Lookup[]>;
    filteredProducts: Observable<Lookup[]>;
    cities: Lookup[] = [];

    @Input() customer: Customer = new Customer();
    @Output() onSave: EventEmitter<any> = new EventEmitter();
    @Output() onCancel: EventEmitter<any> = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private lookupService: LookupService,
        private service: CustomersService,
        private router: Router) {

        this.lookupService.fetchCities('fr').subscribe(res => {
            this.cities = res;
        });
    }

    ngOnInit() {
        this.form = this.fb.group({
            gender: this.fb.control(this.customer.gender ? this.customer.firstname : 'M', Validators.required),
            firstname: this.fb.control(this.customer.firstname, Validators.required),
            lastname: this.fb.control(this.customer.lastname, Validators.required),
            mobile: this.fb.control(this.customer.mobileNumber),
            phone: this.fb.control(this.customer.phoneNumber),
            email: this.fb.control(this.customer.email, (c) => this.customEmailValidator(c)),
            birthdate: this.fb.control(this.customer.birthdate),
            birthCountry: this.fb.control(this.customer.birthCountry),
            nationality: this.fb.control(this.customer.nationality),
            profession: this.fb.control(this.customer.profession),
            address1: this.fb.control(this.customer.address.addressLine1),
            cityZipCode: this.fb.control(null),
            passportNumber: this.fb.control(this.customer.passportNumber),
            passportExpiryDate: this.fb.control(this.customer.passportExpiryDate),
            relationship: this.fb.control(this.customer.relationship),
            howKnewAgency: this.fb.control(this.customer.howKnewAgency),
        });

        this.filteredCities = this.cityZipCode.valueChanges
        .pipe(
            startWith(''),
            debounceTime(200),
            distinctUntilChanged(),
            map(option => option && option.length >= 3 ? this._filterLookup(option, this.cities) : [])
        );
    }

    cancel() {
        this.onCancel.emit(this.customer);
    }

    saveUser() {
        this.loading = true;
        var newCustomer = new Customer();
        newCustomer.gender = this.form.value.gender;
        newCustomer.firstname = this.form.value.firstname;
        newCustomer.lastname = this.form.value.lastname;
        newCustomer.email = this.form.value.email;
        newCustomer.mobileNumber = this.form.value.mobile;
        newCustomer.birthdate = this.form.value.birthdate;
		var cityZipCode = this.getCityZipCode(this.form.value.cityZipCode);
		newCustomer.address.city = cityZipCode[0];
		newCustomer.address.zipCode = cityZipCode[1];
		newCustomer.address.addressLine1 = this.form.value.address1;
        
        this.loader = this.service
            .create(newCustomer)
            .subscribe(
                res => {
                    this.loading = false;
                },
                err => this.loading = false
            );
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

    private _filterLookup(value: string, list: Lookup[]): any[] {
        if (typeof value === 'string') {
            const filterValue = value.toLowerCase();
            return list.filter(c => c.name.toLowerCase().indexOf(filterValue) !== -1);
        }
    }

    displayFn(val: Lookup) {
        return val ? val.name : val;
    }

    private customEmailValidator(control: AbstractControl): ValidationErrors {
        if (!control.value) {
            return null;
        }
        return Validators.email(control);
    }

    private getCityZipCode(value: Lookup) {
        var city = null;
        var zipCode = null;
        if (value && value.id) {
            city = value.id;
            zipCode = value.name.split(' - ')[0];
        }
        return [city, zipCode];
    }
  
    get cityZipCode() { return this.form.get('cityZipCode'); }
    get email() { return this.form.get('email'); }
}
