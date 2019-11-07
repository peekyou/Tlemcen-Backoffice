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

      this.loaderExpenses = forkJoin(
        travelService.getTravelsAsLookup(),
        service.getAllExpenseCategories()
      )
      .subscribe(res => {
        this.travelsLightweight = res[0];
        this.expenseCategories = res[1].concat(<any>res[0]);
      });
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
    }
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
      if (newExpense) {
        this.currentExpensesPage = 1;
        this.getExpenses();
      }
    });
  }

  searchTravels() {
    this.currentRevenuesPage = 1;
    this.getRevenues();
  }

  searchExpenses() {
    this.currentExpensesPage = 1;
    this.getExpenses();
  }

  travelExpensesSelected(travel: Lookup) {
    this.expensesTravel = travel;
    this.getExpenses();
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
            var index = this.expenses.data.indexOf(expense);
            if (index > -1) {
                this.expenses.data.splice(index, 1);
                this.expenses.paging.totalCount--;
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

  fromDateChange(date) {
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

      this.expensesByCategory[category.name].loader = this.service.getExpensesByCategory(search, category.id)
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