import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { UserService } from '../user.service';
import { User, Permission } from '../user.model';
import { ToasterService } from '../../../core/services/toaster.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  user: User;
  form: FormGroup;
  permissions: Permission[];
  isEdit: boolean;
  saveSubscription: Subscription;

  constructor(
    private service: UserService,
    private fb: FormBuilder,
    public toasterService: ToasterService,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) {

      if (data && data.user) {
        this.user = data.user;
        this.isEdit = true;
      }
      else {
        this.user = new User();
      }
    }

  ngOnInit() {
    this.form = this.fb.group({
      username: [this.user.username, Validators.required],
      password: [null],
      passwordConfirmation: [null],
      firstname: [this.user.firstname, Validators.required],
      lastname: [this.user.lastname, Validators.required],
      email: [this.user.email, Validators.email],
      status: [this.user.status],
      permissions: this.fb.array([]),
      userPermissions: this.fb.array([])
    }, { validator: this.areEqual('password', 'passwordConfirmation') });

    this.getPermissions(<FormArray>this.form.controls.permissions);
  }

  areEqual(field1: string, field2: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f1 = group.controls[field1];
      let f2 = group.controls[field2];
      if (f1.value && f2.value && f1.value !== f2.value) {
        return {
          passwords: "Les mots de passe doivent être identiques"
        };
      }
      return {};
    }
  }

  getPermissions(formArray: FormArray) {
    this.service
      .getPermissions()
      .subscribe(p => {
          this.permissions = p;
          this.permissions.forEach(permission => {
              let fg = new FormGroup({});
              fg.addControl(permission.id, new FormControl(false))
              formArray.push(fg);
          });

          if (this.isEdit) {
            this.setPermissionsControls(<FormArray>this.form.controls.permissions, <FormArray>this.form.controls.userPermissions);
          }
      });
  }

  setPermissionsControls(permisionsControl: FormArray, userPermissionsControl: FormArray) {
    if (permisionsControl && userPermissionsControl) {
        this.user.permissions.forEach(permission => {
            var c = permisionsControl.controls.find((x: FormGroup) => {
                return x.get(permission) != null;
            });
            if (c) {
                c.get(permission).patchValue(true);
            }
            userPermissionsControl.push(new FormControl(permission));
        });
    }
  }

  onPermissionChange(permission: Permission, isChecked: boolean) {
    const userPermissions = <FormArray>this.form.controls.userPermissions;

    if (isChecked) {
        userPermissions.push(new FormControl(permission.id));
    } else {
        let index = userPermissions.controls.findIndex(x => x.value == permission.id)
        userPermissions.removeAt(index);
    }
}

submit() {
  let user: User = {
    id: this.user.id,
    username: this.form.value.username,
    password: this.form.value.password,
    firstname: this.form.value.firstname,
    email: this.form.value.email,
    lastname: this.form.value.lastname,
    status: this.form.value.status,
    permissions: this.form.value.userPermissions
  };

  this.saveSubscription = this.service
    .saveUser(user)
    .subscribe(
      res => { 
          this.dialogRef.close(res);
      },
      err => {
          var error = err.error && err.error.errorCode ? err.error.errorCode : true;
          this.toasterService.showToaster(error, false);
          console.log(err); 
      }
    );
  }

  cancel() {
    this.dialogRef.close();
  }

  openDeleteModal() {
  }
}
