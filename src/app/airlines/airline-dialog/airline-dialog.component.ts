import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators,  FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription, Observable } from 'rxjs';

import { Airline } from '../airline.model';
import { AirlinesService } from '../airlines.service';

@Component({
  selector: 'app-airline-dialog',
  templateUrl: './airline-dialog.component.html',
  styleUrls: ['./airline-dialog.component.scss']
})
export class AirlineDialogComponent implements OnInit {
    form: FormGroup;
    loader: Subscription;
    loading = false;
    airline: Airline = new Airline();

    constructor(
      private service: AirlinesService,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<AirlineDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dialog: MatDialog) {
          if (data && data.airline) {
            this.airline = data.airline;
          }
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: this.fb.control(this.airline.name, Validators.required),
            phone: this.fb.control(this.airline.contactPhoneNumber),
            email: this.fb.control(this.airline.contactEmail, (c) => this.customEmailValidator(c))
        });
    }

    cancel() {
      this.dialogRef.close();
    }

    save() {
      this.loading = true;
      var airline = new Airline();
      airline.name = this.form.value.name;
      airline.contactEmail = this.form.value.email;
      airline.contactPhoneNumber = this.form.value.phone;
      
      this.loader = this.service
          .createAirline(airline)
          .subscribe(
              res => {
                  this.loading = false;
                  this.dialogRef.close(res);
              },
              err => this.loading = false
          );
    }

    private customEmailValidator(control: AbstractControl): ValidationErrors {
      if (!control.value) {
          return null;
      }
      return Validators.email(control);
    }

    get email() { return this.form.get('email'); }
}
