import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription, Observable } from 'rxjs';

import { UserService } from '../user.service';
import { User, Role, Permission } from '../user.model';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  user: User = new User();
  form: FormGroup;
  roles: Role[];
  isEdit: boolean = false;
  saveSubscription: Subscription;

  constructor(
    private service: UserService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) {

      if (data && data.user) {
        this.user = data.user;
        this.isEdit = true;
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
      position: [this.user.position],
      permissions: this.fb.array([]),
      userPermissions: this.fb.array([])
    }, { validator: this.areEqual('password', 'passwordConfirmation') });

    this.getRoles(<FormArray>this.form.controls.permissions);
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

  getRoles(formArray: FormArray) {
    this.service
      .getRoles()
      .subscribe(p => {
          this.roles = p;
          this.roles.forEach(permission => {
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
        this.user.roles.forEach(role => {
            var c = permisionsControl.controls.find((x: FormGroup) => {
                return x.get(role.id) != null;
            });
            if (c) {
                c.get(role.id).patchValue(true);
            }
            userPermissionsControl.push(new FormControl(role.id));
        });
    }
  }

  onRoleChange(role: Role, isChecked: boolean) {
    const userPermissions = <FormArray>this.form.controls.userPermissions;

    if (isChecked) {
        userPermissions.push(new FormControl(role.id));
    } else {
        let index = userPermissions.controls.findIndex(x => x.value == role.id)
        userPermissions.removeAt(index);
    }
}

submit() {
  var roles: Role[] = [];
  this.form.value.userPermissions.forEach(roleId => {
    roles.push({ id: roleId })
  });

  this.user.username = this.form.value.username,
  this.user.password = this.form.value.password,
  this.user.firstname = this.form.value.firstname,
  this.user.email = this.form.value.email,
  this.user.lastname = this.form.value.lastname,
  this.user.position = this.form.value.position,
  this.user.roles = roles

  this.saveSubscription = this.save()
    .subscribe(
      res => { 
          this.dialogRef.close(res);
      },
      err => console.log(err)
    );
  }

  save(): Observable<User> {
    return this.isEdit ? this.service.updateUser(this.user) : this.service.createUser(this.user);
  }

  cancel() {
    this.dialogRef.close();
  }
}
