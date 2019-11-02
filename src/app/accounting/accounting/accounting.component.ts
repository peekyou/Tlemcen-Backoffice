import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { DeleteDialogComponent } from '../../components/common/delete-dialog/delete-dialog.component';
import { PagingResponse } from '../../core/models/paging';
import { Travel } from '../../travels/travel.model';
import { TravelRevenues } from '../travel-revenues.model';
import { AccountingService } from '../accounting.service';
import { TravelService } from '../../travels/travel.service';
import { Expense } from '../expense.model';
import { AccountingSummary } from '../accounting-summary.model';
import { Lookup } from '../../core/models/lookup.model';
import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';
import { filterLookup } from '../../core/helpers/utils';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.scss']
})
export class AccountingComponent implements OnInit {
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
  
  constructor(
    private dialog: MatDialog,
    private service: AccountingService,
    private travelService: TravelService) { 
      this.getRevenues();
      this.getExpenses();
      travelService.getTravelsAsLookup().subscribe(x => this.travelsLightweight = x);
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

  getExpenses(travel: Lookup = null) {
    this.loaderExpenses = this.service.getExpenses(this.currentExpensesPage, this.itemsPerPage, this.searchTermExpense, travel ? travel.id : null)
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
    this.getExpenses(travel);
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
}