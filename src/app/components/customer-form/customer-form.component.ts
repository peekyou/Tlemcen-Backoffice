import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

import { LookupService } from '../../core/services/lookup.service';
import { Lookup } from '../../core/models/lookup.model';
import { Customer } from '../../customers/customer.model';

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
            email: this.fb.control(this.customer.email, (c) => this.customEmailValidator(c)),
            birthdate: this.fb.control(this.customer.birthdate),
            address1: this.fb.control(this.customer.address.addressLine1),
            cityZipCode: this.fb.control(null)
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
        // this.loading = true;
        // if (!this.service.user) {
        //     this.service.user = new User();
        // }
        // this.service.user.gender = this.form.value.gender;
        // this.service.user.firstname = this.form.value.firstname;
        // this.service.user.lastname = this.form.value.lastname;
        // this.service.user.email = this.form.value.email;
        // this.service.user.mobileNumber = this.form.value.mobile;
        // this.service.user.birthdate = this.form.value.birthdate;
        // this.service.user.favoriteProducts = [this.form.value.favoriteProduct];
        // if (this.s.config.address && Address.combineCityZipCode(this.s.config.address.country.id)) {
        //     var cityZipCode = this.getCityZipCode(this.form.value.cityZipCode);
        //     this.service.user.address.city = cityZipCode[0];
        //     this.service.user.address.zipCode = cityZipCode[1];
        // }
        // else {
        //     this.service.user.address.city = Lookup.getValue(this.form.value.city);
        // }
        
        // this.service.user.customField1 = CustomerCustomFields.getValue(this.form.value.customField1),
        // this.service.user.customField2 = CustomerCustomFields.getValue(this.form.value.customField2),
        // this.service.user.customField3 = CustomerCustomFields.getValue(this.form.value.customField3),
        // this.service.user.customField4 = CustomerCustomFields.getValue(this.form.value.customField4),

        // this.loader = this.service
        //     .create(this.service.user)
        //     .subscribe(
        //         res => {
        //             this.loading = false;
        //             this.auth.afterLogin(res.loginToken);
        //             this.service.launchTimer();
        //             this.router.navigate(['/loyaltycard'], { queryParams: { t: res.urlToken }});
        //         },
        //         err =>this.loading = false
        //     );

    this.onSave.emit();
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
