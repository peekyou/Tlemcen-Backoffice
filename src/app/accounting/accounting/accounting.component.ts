import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { DeleteDialogComponent } from '../../components/common/delete-dialog/delete-dialog.component';
import { PagingResponse } from '../../core/models/paging';
import { Travel } from '../../travels/travel.model';
import { TravelRevenues } from '../travel-revenues.model';
import { AccountingService } from '../accounting.service';
import { TravelService } from '../../travels/travel.service';
import { PaymentService } from '../../payments/payment.service';
import { Payment } from '../../payments/payment.model';
import { PaymentDialogComponent } from '../../components/payment/payment-dialog/payment-dialog.component';
import { Expense , ExpenseCategory} from '../expense.model';
import { AccountingSummary } from '../accounting-summary.model';
import { Lookup } from '../../core/models/lookup.model';
import { TableSearch } from '../../core/models/table-search.model';
import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';
import { filterLookup, validateDate, dateToUTC } from '../../core/helpers/utils';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.scss']
})
export class AccountingComponent implements OnInit {
  validateDate: Function;
  currentDate = new Date();
  revenuesExpanded: boolean = true;
  expensesExpanded: boolean = true;
  summaryExpanded: boolean = true;
  searchTermExpense: string = '';
  searchTermRevenues: string = '';
  itemsPerPage = 20;
  currentRevenuesPage: number = 1;
  currentExpensesPage: number = 1;
  travels: PagingResponse<TravelRevenues>;
  expenses: PagingResponse<Expense>;
  travelsLightweight: Lookup[] = [];
  expensesTravelControl = new FormControl();
  filteredExpensesTravel: Observable<Lookup[]>;  
  travelSummaryControl = new FormControl();
  filteredTravelSummay: Observable<Lookup[]>;  
  travelSummary: AccountingSummary;
  loaderRevenues: Subscription;
  loaderExpenses: Subscription;
  exporting: boolean = false;
  expensesFrom: Date;
  expensesTo: Date;
  expensesTravel: Lookup = null;
  paymentsByTravel = {};
  expenseCategories: ExpenseCategory[] = [];
  expensesByCategory = {};
  
  constructor(
    private dialog: MatDialog,
    private service: AccountingService,
    private travelService: TravelService,
    private paymentService: PaymentService) { 
   
      this.validateDate = validateDate;
      this.getRevenues();
      // this.getExpenses();
      this.getAllExpenseCategories();
  }

  ngOnInit() {
    this.filteredExpensesTravel = this.expensesTravelControl.valueChanges
    .pipe(
        startWith(''),
        distinctUntilChanged(),
        debounceTime(200),
        map(option => {
          if (option === null || option.id) {
            this.travelExpensesSelected(option);
          }
          return option ? filterLookup(option, this.travelsLightweight) : this.travelsLightweight.slice()
        })
    );

    this.filteredTravelSummay = this.travelSummaryControl.valueChanges
    .pipe(
        startWith(''),
        distinctUntilChanged(),
        debounceTime(200),
        map(option => option ? filterLookup(option, this.travelsLightweight) : this.travelsLightweight.slice())
    );
  }

  getAllExpenseCategories() {
    this.loaderExpenses = forkJoin(
      this.travelService.getTravelsAsLookup(),
      this.service.getAllExpenseCategories()
    )
    .subscribe(res => {
      this.travelsLightweight = res[0];
      this.expenseCategories = res[1].filter(x => x.id != 2).concat(<any>res[0]);
    });
  }

  getRevenues() {
    window.scroll(0,0);
    this.loaderRevenues = this.service.getRevenues(this.currentRevenuesPage, this.itemsPerPage, this.searchTermRevenues)
    .subscribe(
      res => this.travels = res,
      err => console.log(err)
    );
  }

  getExpenses() {
    var search = {
      pageNumber: this.currentExpensesPage,
      itemsCount: this.itemsPerPage,
      searchTerm: this.searchTermExpense,
      travelId: this.expensesTravel ? parseInt(this.expensesTravel.id) : null,
      from: dateToUTC(this.expensesFrom),
      to: dateToUTC(this.expensesTo)
    };

    this.loaderExpenses = this.service.getExpenses(search)
    .subscribe(
      res => this.expenses = res,
      err => console.log(err)
    );
  }

  openExpenseDialog(expense: Expense = null) {
    let dialogRef = this.dialog.open(ExpenseDialogComponent, {
      autoFocus: false,
      width: '700px',
      data: {
        expense: expense
      }
    });

    dialogRef.afterClosed().subscribe(newExpense => {
      var isUpdate = expense != null;
      if (newExpense && newExpense.category) {
        var newIndex = newExpense.category.id == 2 ? newExpense.subcategory ? newExpense.subcategory.name : null : newExpense.category.name;        
      }
      if (expense && expense.category) {
        var oldIndex = expense.category.id == 2 ? expense.subcategory ? expense.subcategory.name : null : expense.category.name;        
      }

      if (!isUpdate && newIndex && this.expensesByCategory[newIndex] != null) {
        this.expensesByCategory[newIndex] = null;
        this.showExpenses(newExpense.category.id == 2 ? newExpense.subcategory : newExpense.category);
      }
      else if (isUpdate && oldIndex) {
        if (oldIndex != newIndex) {
          var i = this.expensesByCategory[oldIndex].expenses.indexOf(expense);
          if (i > -1) {
            this.expensesByCategory[oldIndex].expenses.splice(i, 1);
          }
        }
        else {
          var existing: Expense = this.expensesByCategory[newIndex].expenses.find(x => x.id == expense.id);
          if (existing != null) {
            existing.amount = newExpense.amount;
            existing.attachments = newExpense.attachments;
            existing.category = newExpense.category;
            existing.subcategory = newExpense.subcategory;
            existing.date = newExpense.date;
            existing.details = newExpense.details;
            existing.hasFile = newExpense.hasFile;
            existing.paymentTypeId = newExpense.paymentTypeId;
            existing.title = newExpense.title;
          }
        }
      }
    });
  }

  searchTravels() {
    this.currentRevenuesPage = 1;
    this.getRevenues();
  }

  getTravelSummary(travel: Lookup) {
    this.service.getSummary(travel.id)
    .subscribe(
      res => this.travelSummary = res,
      err => console.log(err)
    )
  }

  displayFn(val: Lookup) {
    if (typeof val === 'string') {
      var l = this.travelsLightweight ? this.travelsLightweight.find(a => a.id == val) : null;
      return l ? l.name : val;
    }
    return val ? val.name : val;
  }

  travelsPageChanged(page) {
    this.currentRevenuesPage = page;
    this.getRevenues();
  }

  expensesPageChanged(page) {
    this.currentExpensesPage = page;
    this.getExpenses();
  }

  openDeleteDialog(expense: Expense) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { name: expense.title }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.deleteExpense(expense.id)
        .subscribe(
          res => {
            // var index = this.expenses.data.indexOf(expense);
            // if (index > -1) {
            //     this.expenses.data.splice(index, 1);
            //     this.expenses.paging.totalCount--;
            // }
            var index = expense.category.id == 2 ? expense.subcategory.name : expense.category.name;
            var i = this.expensesByCategory[index].expenses.indexOf(expense);
            if (i > -1) {
              this.expensesByCategory[index].expenses.splice(i, 1);
            }
          },
          err => console.log(err)
        );
      }
    });
  }

  downloadFile(expense: Expense) {
    this.service.downloadExpenseFile(expense.id).subscribe(x => {});
  }

  downloadInvoice(payment: Payment) {
    this.travelService.downloadInvoice(payment.travelId, [payment.customer.id]).subscribe(x => {});
  }

  exportExpensesExcel() {
    var travelId = this.expensesTravelControl.value ? this.expensesTravelControl.value.id : '';
    this.exporting = true;
    this.service.downloadExpenses('xlsx', travelId).subscribe(x => this.exporting = false);
  }

  exportExpensesCSV() {
    var travelId = this.expensesTravelControl.value ? this.expensesTravelControl.value.id : '';
    this.exporting = true;
    this.service.downloadExpenses('csv', travelId).subscribe(x => this.exporting = false);
  }
  
  showPayments(travel: Travel, showMore: boolean = false) {
    var load = false;
    if (!this.paymentsByTravel[travel.id]) {
      load = true;
      this.paymentsByTravel[travel.id] = {
        currentPage: 1,
        payments: [],
        totalCount: 0,
        show: true
      }
    }
    else {
      this.paymentsByTravel[travel.id].show = true;
    }

    if (showMore) {
      load = true;
      this.paymentsByTravel[travel.id].currentPage++;
    }
    
    if (load) {
      this.paymentsByTravel[travel.id].loader = this.paymentService.getPayments(this.paymentsByTravel[travel.id].currentPage, this.itemsPerPage, travel.id)
        .subscribe(res => {
          this.paymentsByTravel[travel.id].payments = this.paymentsByTravel[travel.id].payments.concat(res.data);
          this.paymentsByTravel[travel.id].totalCount = res.paging.totalCount;
        });
    }
  }

  hidePayments(travel: Travel) {
    this.paymentsByTravel[travel.id].show = false;
  }

  openPaymentDialog(payment: Payment) {
    let dialogRef = this.dialog.open(PaymentDialogComponent, {
      autoFocus: true,
      width: '534px',
      data: {
        payment
      }
    });
  }

  searchExpenses() {
    this.currentExpensesPage = 1;
    this.getExpenses();
  }

  travelExpensesSelected(travel: Lookup) {
    if (travel) {
      this.expensesTravel = travel;
      this.expenseCategories = <any>this.travelsLightweight.filter(x => x.id == travel.id); 
    }
  }

  fromDateChange(date) {
    console.log(this.travelsLightweight)
    this.getExpenses();
  }

  toDateChange(date) {
    this.getExpenses();
  }

  showExpenses(category: ExpenseCategory, showMore: boolean = false) {
    var load = false;
    if (!this.expensesByCategory[category.name]) {
      load = category.expanded = true;
      this.expensesByCategory[category.name] = {
        currentPage: 1,
        expenses: [],
        totalCount: 0
      }
    }
    else {
      category.expanded = true;
    }

    if (showMore) {
      load = true;
      this.expensesByCategory[category.name].currentPage++;
    }

    if (load) {
      var search = {
        pageNumber: this.expensesByCategory[category.name].currentPage,
        itemsCount: this.itemsPerPage,
        searchTerm: this.searchTermExpense,
        travelId: this.expensesTravel ? parseInt(this.expensesTravel.id) : null,
        from: dateToUTC(this.expensesFrom),
        to: dateToUTC(this.expensesTo)
      }

      var categoryId = category.parentId != null ? 2 : category.id;
      var subcategoryId = categoryId == 2 ? category.id : null;
      this.expensesByCategory[category.name].loader = this.service.getExpensesByCategory(search, categoryId, subcategoryId)
        .subscribe(res => {
          this.expensesByCategory[category.name].expenses = this.expensesByCategory[category.name].expenses.concat(res.data);
          this.expensesByCategory[category.name].totalCount = res.paging.totalCount;
        });
    }
  }

  hideExpenses(category: ExpenseCategory) {
    category.expanded = false;
  }
}