import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AccountingService } from '../accounting.service';
import { Expense, ExpenseCategory } from '../expense.model';
import { Payment, PaymentType } from '../../payments/payment.model';
import { validateDate, filterLookup, dateToMoment } from '../../core/helpers/utils';
import { ExpenseCategoryDialogComponent } from '../../components/expenses/category-dialog/expense-category-dialog.component';
import { Lookup } from '../../core/models/lookup.model';
import { TravelService } from '../../travels/travel.service';
import { PaymentService } from '../../payments/payment.service';

@Component({
  selector: 'app-expense-dialog',
  templateUrl: './expense-dialog.component.html',
  styleUrls: ['./expense-dialog.component.scss']
})
export class ExpenseDialogComponent implements OnInit {
  validateDate: Function;
  form: FormGroup;
  success = true;
  submitSubscription: Subscription;
  loader: Subscription;
  expense: Expense = new Expense();
  paymentTypes: PaymentType[] = [];
  travelsLightweight: Lookup[] = [];
  categories: ExpenseCategory[] = [];
  subcategories: ExpenseCategory[] = [];
  categorySubcategories: ExpenseCategory[] = [];  
  filteredCategories: Observable<Lookup[]>;
  filteredSubcategories: Observable<Lookup[]>;
  
  constructor(
    public dialogRef: MatDialogRef<ExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private service: AccountingService,
    private travelService: TravelService,
    private paymentService: PaymentService) {

      this.validateDate = validateDate;
      this.paymentService.getPaymentTypes().subscribe(res => this.paymentTypes = res);    
    }

  ngOnInit() {
    if (this.data && this.data.expense) {
      // this.expense = data.expense;
      this.loader = this.service.getExpense(this.data.expense.id)
      .subscribe(res => {
        this.expense = res;
        this.initLookups(true);
        
        if (this.expense.attachments.length == 0) {
          this.expense.attachments.push(null);
        }
      });
    }
    else {
      this.initForm();
      this.initLookups();
      this.initAutocompletes();

      // Add an element for the upload file component
      this.expense.attachments.push(null);
    }
  }

  initForm() {
    if (this.expense.category) {
      this.setSubcategories(this.expense.category);
    }

    this.form = this.fb.group({
      title: [this.expense.title, Validators.required],
      date: [dateToMoment(this.expense.date)],
      category: [this.expense.category],
      subcategory: [this.expense.subcategory],
      amount: [this.expense.amount, Validators.required],
      paymentType: [this.expense.paymentTypeId],
      details: [this.expense.details]
    });
  }

  initLookups(initFormAfter: boolean = false) {
    this.loader = forkJoin(
      this.service.getAllExpenseCategories(),
      this.service.getAllExpenseSubcategories(),
      this.travelService.getTravelsAsLookup()
    )
    .subscribe(res => {
      this.categories = res[0];
      this.subcategories = res[1];
      this.travelsLightweight = res[2];

      if (initFormAfter) {
        this.initForm();
        this.initAutocompletes();
      }
    });
  }

  initAutocompletes() {
    this.filteredCategories = this.category.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(option => option ? filterLookup(option, this.categories) : this.categories.slice())
    );

    this.filteredSubcategories = this.subcategory.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        map(option => option ? filterLookup(option, this.categorySubcategories) : this.categorySubcategories.slice())
    );
  }

  getSubcategories(category: ExpenseCategory) {
    this.setSubcategories(category);
    this.subcategory.setValue(null);
    this.subcategory.updateValueAndValidity({ onlySelf: true, emitEvent: true });
  }

  setSubcategories(category: ExpenseCategory) {
    if (category.id == 2) {
      this.categorySubcategories = <any>this.travelsLightweight;
    }
    else {
      this.categorySubcategories = this.subcategories.filter(x => x.parentId == category.id);      
    }
  }

  displayFn(val: Lookup) {
    if (typeof val === 'string') {
      var l = this.categories ? this.categories.find(a => a.id == val) : null;
      return l ? l.name : val;
    }
    return val ? val.name : val;
  }

  openCategoryDialog(isSubcategory = false) {
    let dialogRef = this.dialog.open(ExpenseCategoryDialogComponent, {
      autoFocus: true,
      width: '534px',
      data: {
        parentCategoryId: isSubcategory ? this.form.value.category.id : null
      }
    });

    dialogRef.afterClosed().subscribe(newCategory => {
      if (newCategory) {
        if (newCategory.parentId) {
          this.subcategories.unshift(newCategory);
          this.form.patchValue({
            subcategory: newCategory
          });
        }
        else {
          this.categories.unshift(newCategory);
          this.form.patchValue({
            category: newCategory,
            subcategory: null
          });
        }
      }
    });
  }

  addFile = (file) => {
    if (!this.expense.attachments) {
      this.expense.attachments = [];
    }
    this.expense.attachments.push(file);
  }

  onSubmit() {
    this.expense.title = this.form.value.title;
    this.expense.date = this.form.value.date;
    this.expense.amount = this.form.value.amount;
    this.expense.category = this.form.value.category;
    this.expense.subcategory = this.form.value.subcategory;
    this.expense.paymentTypeId = this.form.value.paymentType;
    this.expense.details = this.form.value.details;

    this.submitSubscription = this.saveExpense(this.expense)
      .subscribe(
          newExpense => {
            this.close(newExpense)
          },
          err => console.log(err)
      );
  }

  saveExpense(expense): Observable<Expense> {
    return expense.id ? this.service.updateExpense(expense) : this.service.createExpense(expense);
  }

  close(expense = null): void {
      this.dialogRef.close(expense);
  }

  get date() { return this.form.get('date'); }
  get category() { return this.form.get('category'); }
  get subcategory() { return this.form.get('subcategory'); }
}
