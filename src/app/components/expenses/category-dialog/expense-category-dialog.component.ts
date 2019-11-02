import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

import { AccountingService } from '../../../accounting/accounting.service';
import { Expense, ExpenseCategory } from '../../../accounting/expense.model';

@Component({
  templateUrl: './expense-category-dialog.component.html',
  styleUrls: ['./expense-category-dialog.component.scss']
})
export class ExpenseCategoryDialogComponent implements OnInit {
  form: FormGroup;
  success = true;
  submitSubscription: Subscription;
  loader: Subscription;
  category: ExpenseCategory = new ExpenseCategory();
  parentCategoryId: number = null;
  
  constructor(
    public dialogRef: MatDialogRef<ExpenseCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private service: AccountingService) {

      if (data && data.category) {
        this.category = data.category;
      }
      if (data && data.parentCategoryId) {
        this.parentCategoryId = data.parentCategoryId;
      }
    }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: [this.category.name, Validators.required],
    });
  }

  onSubmit() {
    this.category.parentId = this.category.parentId || this.parentCategoryId;
    this.category.name = this.form.value.name;
    this.submitSubscription = this.service.saveExpenseCategory(this.category)
      .subscribe(
        res => this.close(res),
        err => console.log(err)
      );
  }

  close(expense = null): void {
      this.dialogRef.close(expense);
  }

  get date() { return this.form.get('date'); }
}
