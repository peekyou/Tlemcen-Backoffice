import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { PagingResponse } from '../../../core/models/paging';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { DeleteDialogComponent } from '../../../components/common/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  loader: Subscription;
  currentPage: number = 1;
  itemsPerPage: number = 20;
  users: PagingResponse<User>;

  constructor(private service: UserService, private dialog: MatDialog) { 
    this.getUsers();
  }

  ngOnInit() {
  }

  getUsers() {
    window.scroll(0,0);

    this.loader = this.service.getUsers(this.currentPage, this.itemsPerPage)
    .subscribe(
      res => this.users = res,
      err => console.log(err)
    );
  }

  pageChanged(page) {
    this.currentPage = page;
    this.getUsers();
  }

  openUserDialog(user: User = null) {
    let dialogRef = this.dialog.open(UserDialogComponent, {
      autoFocus: false,
      width: '534px',
      data: {
        user: user
      }
    });

    dialogRef.afterClosed().subscribe((user: User) => {
      if (user) {
        this.currentPage = 1;
        this.getUsers();
      }
    });
  }

  openDeleteDialog(user: User) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { name: user.username }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.deleteUser(user.id)
        .subscribe(
          res => {
            var index = this.users.data.indexOf(user);
            if (index > -1) {
                this.users.data.splice(index, 1);
                this.users.paging.totalCount--;
            }
          },
          err => console.log(err)
        );
      }
    });
  }
}
