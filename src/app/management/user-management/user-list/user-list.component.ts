import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { User } from '../user.model';
import { UserService } from '../user.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[];

  constructor(private service: UserService, private dialog: MatDialog) { 
    this.users = service.users;
  }

  ngOnInit() {
  }

  openUserDialog(user: User = null) {
    let dialogRef = this.dialog.open(UserDialogComponent, {
      autoFocus: false,
      // width: '534px',
      data: {
        user: user
      }
    });

    dialogRef.afterClosed().subscribe((res: User) => {
      var found = this.users.find(x => x.id == res.id);
      if (found) {
        this.updateUser(found, res);
      }
      else {
        this.users.unshift(res);
      }
    });
  }

  updateUser(oldUser: User, newUser: User) {
    oldUser.firstname = newUser.firstname;
    oldUser.lastname = newUser.lastname;
    oldUser.status = newUser.status;
    oldUser.email = newUser.email;
    oldUser.permissions = newUser.permissions;
  }
}
