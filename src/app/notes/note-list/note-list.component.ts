import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { PagingResponse } from '../../core/models/paging';
import { DeleteDialogComponent } from '../../components/common/delete-dialog/delete-dialog.component';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';
import { NoteService } from '../note.service';
import { Note } from '../note.model';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {
  loader: Subscription;
  currentPage: number = 1;
  itemsPerPage: number = 20;
  notes: PagingResponse<Note>;

    constructor(private service: NoteService, private dialog: MatDialog) { 
      this.getNotes();
  }

  ngOnInit() {
  }

  getNotes() {
    window.scroll(0,0);

    this.loader = this.service.getNotes(this.currentPage, this.itemsPerPage)
    .subscribe(
      res => this.notes = res,
      err => console.log(err)
    );
  }

  pageChanged(page) {
    this.currentPage = page;
    this.getNotes();
  }

  openNoteDialog(note: Note = null) {
    let dialogRef = this.dialog.open(NoteDialogComponent, {
      autoFocus: true,
      width: '534px',
      data: {
        note: note
      }
    });

    dialogRef.afterClosed().subscribe(newNote => {
      if (newNote) {
        this.currentPage = 1;
        this.getNotes();
      }
    });
  }

  openDeleteDialog(note: Note) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { name: note.title }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.deleteNote(note.id)
        .subscribe(
          res => {
            var index = this.notes.data.indexOf(note);
            if (index > -1) {
                this.notes.data.splice(index, 1);
                this.notes.paging.totalCount--;
            }
          },
          err => console.log(err)
        );
      }
    });
  }
}
