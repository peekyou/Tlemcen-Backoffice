import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { ExpenseCategoryDialogComponent } from '../../../components/expenses/category-dialog/expense-category-dialog.component';
import { DeleteDialogComponent } from '../../../components/common/delete-dialog/delete-dialog.component';
import { AccountingService } from '../../../accounting/accounting.service';
import { ExpenseCategory } from '../../../accounting/expense.model';
import { PagingResponse } from '../../../core/models/paging';
import { TravelType } from '../../../travels/travel.model';

@Component({
  selector: 'app-expense-category-list',
  templateUrl: './expense-category-list.component.html',
  styleUrls: ['./expense-category-list.component.scss']
})
export class ExpenseCategoryListComponent implements OnInit {
  loader: Subscription;
  currentPage: number = 1;
  itemsPerPage: number = 20;
  categories: PagingResponse<ExpenseCategory>;

  constructor(private dialog: MatDialog, private service: AccountingService) {
      this.getExpenseCategories();
  }

  ngOnInit() {
  }

  getExpenseCategories() {
    window.scroll(0,0);

    this.loader = this.service.getExpenseCategories(this.currentPage, this.itemsPerPage)
    .subscribe(
      res => this.categories = res,
      err => console.log(err)
    );
  }

  pageChanged(page: number) {
    this.currentPage = page;
    this.getExpenseCategories();
  }

  openCategoryDialog(category: ExpenseCategory, isNewSubcategory = false) {
    let dialogRef = this.dialog.open(ExpenseCategoryDialogComponent, {
      autoFocus: true,
      width: '534px',
      data: {
        category: isNewSubcategory ? null : category,
        parentCategoryId: isNewSubcategory ? category.id : null
      }
    });

    dialogRef.afterClosed().subscribe(savedCategory => {
      if (savedCategory) {
        this.currentPage = 1;
        this.getExpenseCategories();
      }
    });
  }

  openDeleteDialog(category: ExpenseCategory) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { name: category.name }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.deleteExpenseCategory(category.id)
        .subscribe(
          res => {
            this.currentPage = 1;
            this.getExpenseCategories();
          },
          err => console.log(err)
        );
      }
    });
  }
}
