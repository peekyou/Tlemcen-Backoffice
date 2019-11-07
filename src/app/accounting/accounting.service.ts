import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { TravelRevenues } from './travel-revenues.model';
import { Expense, ExpenseCategory } from './expense.model';
import { AccountingSummary } from './accounting-summary.model';
import { AuthHttpService } from '../core/services/auth-http.service';
import { PagingResponse } from '../core/models/paging';
import { AppFile } from '../core/models/file.model';
import { Lookup } from '../core/models/lookup.model';
import { TableSearch } from '../core/models/table-search.model';

@Injectable()
export class AccountingService {
  resource = 'accounting';

  constructor(private http: AuthHttpService) { }

  getRevenues(page: number = null, count: number = null, searchTerm: string = ''): Observable<PagingResponse<TravelRevenues>> {
    return this.http.get(this.resource + '/revenues?pageNumber=' + page + '&itemsCount=' + count + '&searchTerm=' + searchTerm);
  }

  getExpenses(tableSearch: TableSearch): Observable<PagingResponse<Expense>> {
    return this.http.post(this.resource + '/expenses/search', tableSearch);
  }

  getExpensesByCategory(tableSearch: TableSearch, categoryId, subcategoryId = ''): Observable<PagingResponse<Expense>> {
    return this.http.post(this.resource + '/expenses/search/' + categoryId + '?subcategoryId=' + subcategoryId, tableSearch);
  }

  getExpense(id): Observable<Expense> {
    return this.http.get(this.resource + '/expenses/' + id);
  }

  createExpense(expense: Expense): Observable<Expense> {
    this.validateExpense(expense);
    return this.http.post(this.resource + '/expenses', expense);
  }

  updateExpense(expense: Expense): Observable<Expense> {
    this.validateExpense(expense);
    return this.http.put(this.resource + '/expenses/' + expense.id, expense);
  }

  deleteExpense(id: string) : Observable<boolean> {
    return this.http.delete(this.resource + '/expenses/' + id);
  }

  getExpenseCategories(page: number = null, count: number = null): Observable<PagingResponse<ExpenseCategory>> {
    return this.http.get(this.resource + '/expenses/categories?pageNumber=' + page + '&itemsCount=' + count);
  }

  getAllExpenseCategories(): Observable<ExpenseCategory[]> {
    return this.http.get(this.resource + '/expenses/categories/all');
  }

  getAllExpenseSubcategories(): Observable<ExpenseCategory[]> {
    return this.http.get(this.resource + '/expenses/subcategories/all');
  }

  saveExpenseCategory(expenseCategory: ExpenseCategory): Observable<ExpenseCategory> {
    return this.http.post(this.resource + '/expenses/categories', expenseCategory);
  }

  deleteExpenseCategory(id: number) : Observable<boolean> {
    return this.http.delete(this.resource + '/expenses/categories/' + id);
  }

  getSummary(travelId: string): Observable<AccountingSummary> {
    return this.http.get(this.resource + '/summary/' + travelId);
  }

  downloadExpenses(format: string, travelId: string = ''): Observable<void> {
    return this.http.download(this.resource + '/expenses/' + format + '?travelId=' + travelId);
  }

  downloadExpenseFile(expenseId): Observable<void> {
    return this.http.download(this.resource + '/expenses/' + expenseId + '/file');
  }

  private validateExpense(expense: Expense) {
    if (expense.category) {
      expense.category.id = parseInt(<any>expense.category.id);
    }
    if (expense.subcategory) {
      expense.subcategory.id = parseInt(<any>expense.subcategory.id);
      expense.subcategory.parentId = expense.subcategory.parentId != null ? parseInt(<any>expense.subcategory.parentId) : null;
    }
  }
}