import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Note } from './note.model';
import { PagingResponse } from '../core/models/paging';
import { AuthHttpService } from '../core/services/auth-http.service';

@Injectable()
export class NoteService {
  resource = 'notes';

  constructor(private http: AuthHttpService) { }

  getNotes(page: number, count: number): Observable<PagingResponse<Note>> {
    return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count);
  }

  getNote(id): Observable<Note> {
    return this.http.get(this.resource + '/' + id);
  }

  createNote(note: Note) : Observable<Note> {
    return this.http.post(this.resource, note);
  }

  updateNote(note: Note) : Observable<Note> {
    return this.http.put(this.resource + '/' + note.id, note);
  }
  
  deleteNote(id: string) : Observable<boolean> {
    return this.http.delete(this.resource + '/' + id);
  }
}
